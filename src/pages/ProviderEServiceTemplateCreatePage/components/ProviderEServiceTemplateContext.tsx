import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import type {
  EServiceMode,
  EServiceTemplateVersionDetails,
  TenantKind,
} from '@/api/api.generatedTypes'

type EServiceTemplateCreateContextType = {
  templateVersion: EServiceTemplateVersionDetails | undefined
  eserviceTemplateMode: EServiceMode
  onEserviceTemplateModeChange: (value: EServiceMode) => void
  back: VoidFunction
  forward: VoidFunction
  areEServiceTemplateGeneralInfoEditable: boolean
  riskAnalysisFormState: {
    isOpen: boolean
    riskAnalysisId: string | undefined
  }
  tenantKind: TenantKind
  openRiskAnalysisForm: (value: {
    riskAnalysisId?: string
    tenantKindSelected?: TenantKind
  }) => void
  closeRiskAnalysisForm: VoidFunction
}

const initialState: EServiceTemplateCreateContextType = {
  templateVersion: undefined,
  eserviceTemplateMode: 'DELIVER',
  onEserviceTemplateModeChange: noop,
  back: noop,
  forward: noop,
  areEServiceTemplateGeneralInfoEditable: true,
  riskAnalysisFormState: {
    isOpen: false,
    riskAnalysisId: undefined,
  },
  tenantKind: 'PA',
  openRiskAnalysisForm: noop,
  closeRiskAnalysisForm: noop,
}

const { useContext, Provider } = createContext<EServiceTemplateCreateContextType>(
  'EServiceTemplateCreateContext',
  initialState
)

type EServiceTemplateCreateContextProviderProps = {
  children: React.ReactNode
  templateVersion: EServiceTemplateVersionDetails | undefined
  eserviceTemplateMode: EServiceMode
  onEserviceTemplateModeChange: (value: EServiceMode) => void
  back: VoidFunction
  forward: VoidFunction
}

const EServiceTemplateCreateContextProvider: React.FC<
  EServiceTemplateCreateContextProviderProps
> = ({
  children,
  templateVersion,
  eserviceTemplateMode,
  onEserviceTemplateModeChange,
  back,
  forward,
}) => {
  const [riskAnalysisFormState, setRiskAnalysisFormState] = React.useState<{
    isOpen: boolean
    riskAnalysisId: string | undefined
  }>({
    isOpen: false,
    riskAnalysisId: undefined,
  })

  const [tenantKind, setTenantKind] = React.useState<TenantKind>('PA')

  const openRiskAnalysisForm = ({
    riskAnalysisId,
    tenantKindSelected,
  }: {
    riskAnalysisId?: string
    tenantKindSelected?: TenantKind
  }) => {
    if (tenantKindSelected) {
      setTenantKind(tenantKindSelected)
    }
    setRiskAnalysisFormState({
      isOpen: true,
      riskAnalysisId: riskAnalysisId,
    })
  }

  const closeRiskAnalysisForm = () => {
    setRiskAnalysisFormState({
      isOpen: false,
      riskAnalysisId: undefined,
    })
  }

  const providerValue = React.useMemo(() => {
    const areEServiceTemplateGeneralInfoEditable = Boolean(
      // case 1: new e-service template
      !templateVersion ||
        // case 3: already existing service template and version, but version is 1 and still a draft
        (templateVersion && templateVersion.version === 1 && templateVersion.state === 'DRAFT')
    )

    return {
      templateVersion,
      eserviceTemplateMode,
      onEserviceTemplateModeChange,
      areEServiceTemplateGeneralInfoEditable,
      back,
      forward,
      riskAnalysisFormState,
      openRiskAnalysisForm,
      closeRiskAnalysisForm,
      tenantKind,
    }
  }, [
    templateVersion,
    eserviceTemplateMode,
    onEserviceTemplateModeChange,
    back,
    forward,
    riskAnalysisFormState,
    tenantKind,
  ])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceTemplateCreateContext, EServiceTemplateCreateContextProvider }
