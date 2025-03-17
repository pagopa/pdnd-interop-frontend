import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import type {
  EServiceMode,
  EServiceTemplateVersionDetails,
  TenantKind,
} from '@/api/api.generatedTypes'

type EServiceTemplateCreateContextType = {
  template: EServiceTemplateVersionDetails | undefined
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
  template: undefined,
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
  template: EServiceTemplateVersionDetails | undefined
  eserviceTemplateMode: EServiceMode
  onEserviceTemplateModeChange: (value: EServiceMode) => void
  back: VoidFunction
  forward: VoidFunction
}

const EServiceTemplateCreateContextProvider: React.FC<
  EServiceTemplateCreateContextProviderProps
> = ({ children, template, eserviceTemplateMode, onEserviceTemplateModeChange, back, forward }) => {
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
      !template ||
        // case 3: already existing service template and version, but version is 1 and still a draft
        (template && template.version === 1 && template.state === 'DRAFT')
    )

    return {
      template,
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
    template,
    eserviceTemplateMode,
    onEserviceTemplateModeChange,
    back,
    forward,
    riskAnalysisFormState,
  ])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceTemplateCreateContext, EServiceTemplateCreateContextProvider }
