import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'

type VoucherInstructionsContextType = {
  goToNextStep: VoidFunction
  goToPreviousStep: VoidFunction
  startStepper: VoidFunction
}

const initialState: VoucherInstructionsContextType = {
  goToNextStep: noop,
  goToPreviousStep: noop,
  startStepper: noop,
}

const { useContext, Provider } = createContext<VoucherInstructionsContextType>(
  'VoucherInstructionsContext',
  initialState
)

type VoucherInstructionsContextProviderProps = {
  children: React.ReactNode
  goToNextStep: VoidFunction
  goToPreviousStep: VoidFunction
  startStepper: VoidFunction
}

const VoucherInstructionsContextProvider: React.FC<VoucherInstructionsContextProviderProps> = ({
  children,
  goToNextStep,
  goToPreviousStep,
  startStepper,
}) => {
  const providerValue = React.useMemo(
    () => ({
      goToNextStep,
      goToPreviousStep,
      startStepper,
    }),
    [goToNextStep, goToPreviousStep, startStepper]
  )

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useVoucherInstructionsContext, VoucherInstructionsContextProvider }
