import React, { useCallback, useMemo, useState } from 'react'
import { createContext } from '@/utils/common.utils'
import type { TenantKind } from '@/api/api.generatedTypes'
import { TenantHooks } from '@/api/tenant'
import { getRiskAnalysisKind } from '@/utils/risk-analysis-form.utils'
import type { RiskAnalysisKind } from '@/types/risk-analysis-form.types'
import noop from 'lodash/noop'

type RiskAnalysisExporterToolState = {
  selectedRiskAnalysisKind: RiskAnalysisKind
  errors: Array<string>
  output: Record<string, string[]>
}

type RiskAnalysisExporterToolContextProvider = RiskAnalysisExporterToolState & {
  tenantRiskAnalysisKind: RiskAnalysisKind
  onRiskAnalysisKindChange: (kind: RiskAnalysisKind) => void
  onRiskAnalysisFormSubmit: (output: Record<string, string[]>, errors: Array<string>) => void
  back: VoidFunction
  forward: VoidFunction
}

const initialState: RiskAnalysisExporterToolContextProvider = {
  tenantRiskAnalysisKind: undefined!,
  selectedRiskAnalysisKind: undefined!,
  errors: [],
  output: {},
  onRiskAnalysisKindChange: noop,
  onRiskAnalysisFormSubmit: noop,
  back: noop,
  forward: noop,
}

const { useContext, Provider } = createContext<RiskAnalysisExporterToolContextProvider>(
  'RiskAnalysisExporterToolContext',
  initialState
)

function RiskAnalysisExporterToolContextProvider({
  children,
  back,
  forward,
}: {
  children: React.ReactNode
  back: VoidFunction
  forward: VoidFunction
}) {
  const { data: currentTenant } = TenantHooks.useGetActiveUserParty()
  const tenantRiskAnalysisKind = getRiskAnalysisKind(currentTenant.kind as TenantKind)

  const [toolState, setToolState] = useState<RiskAnalysisExporterToolState>({
    selectedRiskAnalysisKind: tenantRiskAnalysisKind,
    errors: [],
    output: {},
  })

  const onRiskAnalysisKindChange = useCallback((kind: RiskAnalysisKind) => {
    setToolState({
      selectedRiskAnalysisKind: kind,
      errors: [],
      output: {},
    })
  }, [])

  const onRiskAnalysisFormSubmit = useCallback(
    (output: Record<string, string[]>, errors: Array<string>) => {
      setToolState((prev) => ({
        ...prev,
        errors,
        output,
      }))
      forward()
    },
    [forward]
  )

  const providerValue: RiskAnalysisExporterToolContextProvider = useMemo(() => {
    return {
      ...toolState,
      tenantRiskAnalysisKind,
      onRiskAnalysisKindChange,
      onRiskAnalysisFormSubmit,
      back,
      forward,
    }
  }, [
    toolState,
    tenantRiskAnalysisKind,
    onRiskAnalysisKindChange,
    back,
    forward,
    onRiskAnalysisFormSubmit,
  ])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useRiskAnalysisExporterToolContext, RiskAnalysisExporterToolContextProvider }
