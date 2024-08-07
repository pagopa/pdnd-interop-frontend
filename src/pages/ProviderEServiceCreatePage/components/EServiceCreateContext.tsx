import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import type { EServiceMode, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'

type EServiceCreateContextType = {
  descriptor: ProducerEServiceDescriptor | undefined
  eserviceMode: EServiceMode
  onEserviceModeChange: (value: EServiceMode) => void
  back: VoidFunction
  forward: VoidFunction
  areEServiceGeneralInfoEditable: boolean
  riskAnalysisFormState: {
    isOpen: boolean
    riskAnalysisId: string | undefined
  }
  openRiskAnalysisForm: (riskAnalysisId?: string) => void
  closeRiskAnalysisForm: VoidFunction
}

const initialState: EServiceCreateContextType = {
  descriptor: undefined,
  eserviceMode: 'DELIVER',
  onEserviceModeChange: noop,
  back: noop,
  forward: noop,
  areEServiceGeneralInfoEditable: true,
  riskAnalysisFormState: {
    isOpen: false,
    riskAnalysisId: undefined,
  },
  openRiskAnalysisForm: noop,
  closeRiskAnalysisForm: noop,
}

const { useContext, Provider } = createContext<EServiceCreateContextType>(
  'EServiceCreateContext',
  initialState
)

type EServiceCreateContextProviderProps = {
  children: React.ReactNode
  descriptor: ProducerEServiceDescriptor | undefined
  eserviceMode: EServiceMode
  onEserviceModeChange: (value: EServiceMode) => void
  back: VoidFunction
  forward: VoidFunction
}

const EServiceCreateContextProvider: React.FC<EServiceCreateContextProviderProps> = ({
  children,
  descriptor,
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
    const areEServiceGeneralInfoEditable = Boolean(
      // case 1: new e-service
      !descriptor ||
        // case 3: already existing service and version, but version is 1 and still a draft
        (descriptor && descriptor.version === '1' && descriptor.state === 'DRAFT')
    )

    return {
      descriptor,
      eserviceMode,
      onEserviceModeChange,
      areEServiceGeneralInfoEditable,
      back,
      forward,
      riskAnalysisFormState,
      openRiskAnalysisForm,
      closeRiskAnalysisForm,
    }
  }, [descriptor, eserviceMode, onEserviceModeChange, back, forward, riskAnalysisFormState])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceCreateContext, EServiceCreateContextProvider }
