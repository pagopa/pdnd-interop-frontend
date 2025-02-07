import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import type { EServiceMode, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'

type CreateContextType = {
  descriptor?: ProducerEServiceDescriptor | undefined
  template?: ProducerEServiceDescriptor | undefined //TODO METTERE IL TIPO GIUSTO
  formKind: 'eservice' | 'template' | undefined
  eserviceMode: EServiceMode
  onEserviceModeChange: (value: EServiceMode) => void
  back: VoidFunction
  forward: VoidFunction
  areGeneralInfoEditable: boolean
  riskAnalysisFormState: {
    isOpen: boolean
    riskAnalysisId: string | undefined
  }
  openRiskAnalysisForm: (riskAnalysisId?: string) => void
  closeRiskAnalysisForm: VoidFunction
}

const initialState: CreateContextType = {
  descriptor: undefined,
  template: undefined,
  formKind: undefined,
  eserviceMode: 'DELIVER',
  onEserviceModeChange: noop,
  back: noop,
  forward: noop,
  areGeneralInfoEditable: true,
  riskAnalysisFormState: {
    isOpen: false,
    riskAnalysisId: undefined,
  },
  openRiskAnalysisForm: noop,
  closeRiskAnalysisForm: noop,
}

const { useContext, Provider } = createContext<CreateContextType>('CreateContext', initialState)

type CreateContextProviderProps = {
  children: React.ReactNode
  descriptor?: ProducerEServiceDescriptor | undefined
  template?: ProducerEServiceDescriptor | undefined //TODO
  formKind: 'eservice' | 'template' | undefined
  eserviceMode: EServiceMode
  onEserviceModeChange: (value: EServiceMode) => void
  back: VoidFunction
  forward: VoidFunction
}

const CreateContextProvider: React.FC<CreateContextProviderProps> = ({
  children,
  descriptor,
  template,
  formKind,
  eserviceMode,
  onEserviceModeChange,
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

  const openRiskAnalysisForm = (riskAnalysisId?: string) => {
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
    const areGeneralInfoEditable = Boolean(
      // case 1: new e-service
      !descriptor ||
        // case 3: already existing service and version, but version is 1 and still a draft
        (descriptor && descriptor.version === '1' && descriptor.state === 'DRAFT')
    )

    return {
      descriptor,
      template,
      formKind,
      eserviceMode,
      onEserviceModeChange,
      areGeneralInfoEditable,
      back,
      forward,
      riskAnalysisFormState,
      openRiskAnalysisForm,
      closeRiskAnalysisForm,
    }
  }, [
    descriptor,
    template,
    eserviceMode,
    onEserviceModeChange,
    back,
    forward,
    riskAnalysisFormState,
  ])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useCreateContext, CreateContextProvider }
