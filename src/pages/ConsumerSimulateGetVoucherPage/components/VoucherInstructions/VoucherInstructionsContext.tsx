import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import type { VoucherInstructionsGeneralFormValues } from './VoucherInstructionsGeneralForm'

type VoucherInstructionsContextType = {
  goToNextStep: VoidFunction
  goToPreviousStep: VoidFunction
  startStepper: (values: VoucherInstructionsGeneralFormValues) => void
  resetStepper: VoidFunction
}

const initialState: VoucherInstructionsContextType = {
  goToNextStep: noop,
  goToPreviousStep: noop,
  startStepper: () => {},
  resetStepper: noop,
}

const { useContext, Provider } = createContext<VoucherInstructionsContextType>(
  'VoucherInstructionsContext',
  initialState
)

type VoucherInstructionsContextProviderProps = {
  children: React.ReactNode
  goToNextStep: VoidFunction
  goToPreviousStep: VoidFunction
  startStepper: (values: VoucherInstructionsGeneralFormValues) => void
  resetStepper: VoidFunction
}

const VoucherInstructionsContextProvider: React.FC<VoucherInstructionsContextProviderProps> = ({
  children,
  goToNextStep,
  goToPreviousStep,
  startStepper,
  resetStepper,
}) => {
  const providerValue = React.useMemo(
    () => ({
      goToNextStep,
      goToPreviousStep,
      startStepper,
      resetStepper,
    }),
    [goToNextStep, goToPreviousStep, startStepper, resetStepper]
  )

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useVoucherInstructionsContext, VoucherInstructionsContextProvider }
