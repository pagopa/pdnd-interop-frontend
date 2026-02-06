import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'

type VoucherInstructionsContextType = {
  goToNextStep: VoidFunction
  goToPreviousStep: VoidFunction
}

const initialState: VoucherInstructionsContextType = {
  goToNextStep: noop,
  goToPreviousStep: noop,
}

const { useContext, Provider } = createContext<VoucherInstructionsContextType>(
  'VoucherInstructionsContext',
  initialState
)

type VoucherInstructionsContextProviderProps = {
  children: React.ReactNode
  goToNextStep: VoidFunction
  goToPreviousStep: VoidFunction
}

const VoucherInstructionsContextProvider: React.FC<VoucherInstructionsContextProviderProps> = ({
  children,
  goToNextStep,
  goToPreviousStep,
}) => {
  const providerValue = React.useMemo(
    () => ({
      goToNextStep,
      goToPreviousStep,
    }),
    [goToNextStep, goToPreviousStep]
  )

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useVoucherInstructionsContext, VoucherInstructionsContextProvider }
