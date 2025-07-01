import React, { useCallback } from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import type {
  EServiceMode,
  EServiceTemplateRiskAnalysis,
  EServiceTemplateVersionDetails,
  TenantKind,
} from '@/api/api.generatedTypes'

type RiskAnalysisFormState =
  | {
      type: null
    }
  | {
      type: 'edit'
      riskAnalysis: EServiceTemplateRiskAnalysis
    }
  | {
      type: 'add'
      selectedTenantKind: TenantKind
    }

type EServiceTemplateCreateContextType = {
  templateVersion: EServiceTemplateVersionDetails | undefined
  eserviceTemplateMode: EServiceMode
  onEserviceTemplateModeChange: (value: EServiceMode) => void
  back: VoidFunction
  forward: VoidFunction
  areEServiceTemplateGeneralInfoEditable: boolean
  riskAnalysisFormState: RiskAnalysisFormState
  openEditRiskAnalysisForm: ({
    riskAnalysis,
  }: {
    riskAnalysis: EServiceTemplateRiskAnalysis
  }) => void
  openAddRiskAnalysisForm: ({ selectedTenantKind }: { selectedTenantKind: TenantKind }) => void
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
    type: null,
  },
  openEditRiskAnalysisForm: noop,
  openAddRiskAnalysisForm: noop,
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
  const [riskAnalysisFormState, setRiskAnalysisFormState] = React.useState<RiskAnalysisFormState>({
    type: null,
  })

  const openEditRiskAnalysisForm = useCallback<
    EServiceTemplateCreateContextType['openEditRiskAnalysisForm']
  >(({ riskAnalysis }) => {
    setRiskAnalysisFormState({
      type: 'edit',
      riskAnalysis: riskAnalysis,
    })
  }, [])

  const openAddRiskAnalysisForm = useCallback<
    EServiceTemplateCreateContextType['openAddRiskAnalysisForm']
  >(({ selectedTenantKind }) => {
    setRiskAnalysisFormState({
      type: 'add',
      selectedTenantKind,
    })
  }, [])

  const closeRiskAnalysisForm = useCallback<
    EServiceTemplateCreateContextType['closeRiskAnalysisForm']
  >(() => {
    setRiskAnalysisFormState({
      type: null,
    })
  }, [])

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
      openEditRiskAnalysisForm,
      openAddRiskAnalysisForm,
      closeRiskAnalysisForm,
    }
  }, [
    templateVersion,
    eserviceTemplateMode,
    onEserviceTemplateModeChange,
    openEditRiskAnalysisForm,
    openAddRiskAnalysisForm,
    closeRiskAnalysisForm,
    back,
    forward,
    riskAnalysisFormState,
  ])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceTemplateCreateContext, EServiceTemplateCreateContextProvider }
