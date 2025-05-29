import React, { useCallback, useMemo, useState } from 'react'
import { createContext } from '@/utils/common.utils'
import type { RiskAnalysisFormSeed, TenantKind } from '@/api/api.generatedTypes'
import { TenantHooks } from '@/api/tenant'
import { getRiskAnalysisKind } from '@/utils/risk-analysis-form.utils'
import type { RiskAnalysisKind } from '@/types/risk-analysis-form.types'
import noop from 'lodash/noop'

type RiskAnalysisExporterToolState = {
  selectedRiskAnalysisKind: RiskAnalysisKind
  errors: Array<string>
  output: RiskAnalysisFormSeed | null
}

type RiskAnalysisExporterToolContextProvider = RiskAnalysisExporterToolState & {
  tenantRiskAnalysisKind: RiskAnalysisKind
  onRiskAnalysisKindChange: (kind: RiskAnalysisKind) => void
  onRiskAnalysisFormSubmit: (output: RiskAnalysisFormSeed, errors: Array<string>) => void
  back: VoidFunction
  forward: VoidFunction
}

const initialState: RiskAnalysisExporterToolContextProvider = {
  tenantRiskAnalysisKind: undefined!,
  selectedRiskAnalysisKind: undefined!,
  errors: [],
  output: null,
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

  const [riskAnalysisToolState, setRiskAnalysisToolState] = useState<RiskAnalysisExporterToolState>(
    {
      selectedRiskAnalysisKind: tenantRiskAnalysisKind,
      errors: [],
      output: null,
    }
  )

  const onRiskAnalysisKindChange = useCallback((kind: RiskAnalysisKind) => {
    setRiskAnalysisToolState({
      selectedRiskAnalysisKind: kind,
      errors: [],
      output: null,
    })
  }, [])

  const onRiskAnalysisFormSubmit = useCallback(
    (output: RiskAnalysisFormSeed, errors: Array<string>) => {
      setRiskAnalysisToolState((prev) => ({
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
      ...riskAnalysisToolState,
      tenantRiskAnalysisKind,
      onRiskAnalysisKindChange,
      onRiskAnalysisFormSubmit,
      back,
      forward,
    }
  }, [
    riskAnalysisToolState,
    tenantRiskAnalysisKind,
    onRiskAnalysisKindChange,
    back,
    forward,
    onRiskAnalysisFormSubmit,
  ])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useRiskAnalysisExporterToolContext, RiskAnalysisExporterToolContextProvider }
