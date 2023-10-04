import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import type { ProducerEServiceDescriptor, ProducerEServiceDetails } from '@/api/api.generatedTypes'

type EServiceCreateContextType = {
  eservice: ProducerEServiceDetails | ProducerEServiceDescriptor['eservice'] | undefined
  descriptor: ProducerEServiceDescriptor | undefined
  onEserviceModeChange: (value: string) => void
  back: VoidFunction
  forward: VoidFunction
  riskAnalysisFormState: {
    isOpen: boolean
    riskAnalysisId: string | undefined
  }
  openRiskAnalysisForm: (riskAnalysisId?: string) => void
  closeRiskAnalysisForm: VoidFunction
}

const initialState: EServiceCreateContextType = {
  eservice: undefined,
  descriptor: undefined,
  onEserviceModeChange: noop,
  back: noop,
  forward: noop,
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
  eservice: ProducerEServiceDetails | ProducerEServiceDescriptor['eservice'] | undefined
  descriptor: ProducerEServiceDescriptor | undefined
  onEserviceModeChange: (value: string) => void
  back: VoidFunction
  forward: VoidFunction
}

const EServiceCreateContextProvider: React.FC<EServiceCreateContextProviderProps> = ({
  children,
  eservice,
  descriptor,
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
    return {
      eservice,
      descriptor,
      onEserviceModeChange,
      back,
      forward,
      riskAnalysisFormState,
      openRiskAnalysisForm,
      closeRiskAnalysisForm,
    }
  }, [eservice, descriptor, onEserviceModeChange, back, forward, riskAnalysisFormState])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceCreateContext, EServiceCreateContextProvider }
