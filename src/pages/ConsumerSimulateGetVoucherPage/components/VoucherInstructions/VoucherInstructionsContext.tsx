import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import type { VoucherInstructionsGeneralFormValues } from './VoucherInstructionsGeneralForm'

type VoucherInstructionsContextType = {
  goToNextStep: VoidFunction
  goToPreviousStep: VoidFunction
  startStepper: (values: VoucherInstructionsGeneralFormValues) => void
}

const initialState: VoucherInstructionsContextType = {
  goToNextStep: noop,
  goToPreviousStep: noop,
  startStepper: () => {},
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
