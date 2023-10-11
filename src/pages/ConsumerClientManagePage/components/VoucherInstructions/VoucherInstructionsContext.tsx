import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import { useSearchParams } from 'react-router-dom'

type VoucherInstructionsContextType = {
  selectedPurposeId: string | undefined
  selectedKeyId: string | undefined
  handleSelectedPurposeIdChange: (purpose: string) => void
  handleSelectedKeyIdChange: (key: string) => void
  clientId: string
  goToNextStep: VoidFunction
  goToPreviousStep: VoidFunction
}

const initialState: VoucherInstructionsContextType = {
  selectedPurposeId: undefined,
  selectedKeyId: undefined,
  handleSelectedPurposeIdChange: noop,
  handleSelectedKeyIdChange: noop,
  clientId: '',
  goToNextStep: noop,
  goToPreviousStep: noop,
}

const { useContext, Provider } = createContext<VoucherInstructionsContextType>(
  'VoucherInstructionsContext',
  initialState
)

type VoucherInstructionsContextProviderProps = {
  children: React.ReactNode
  clientId: string
  goToNextStep: VoidFunction
  goToPreviousStep: VoidFunction
}

const VoucherInstructionsContextProvider: React.FC<VoucherInstructionsContextProviderProps> = ({
  children,
  clientId,
  goToNextStep,
  goToPreviousStep,
}) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSelectedPurposeIdChange = React.useCallback(
    (purposeId: string) => {
      setSearchParams((prev) => {
        prev.set('purposeId', purposeId)
        return prev
      })
    },
    [setSearchParams]
  )

  const handleSelectedKeyIdChange = React.useCallback(
    (keyId: string) => {
      setSearchParams((prev) => {
        prev.set('keyId', keyId)
        return prev
      })
    },
    [setSearchParams]
  )

  const selectedPurposeId = searchParams.get('purposeId') || undefined
  const selectedKeyId = searchParams.get('keyId') || undefined

  const providerValue = React.useMemo(
    () => ({
      selectedPurposeId,
      handleSelectedPurposeIdChange,
      selectedKeyId,
      handleSelectedKeyIdChange,
      clientId,
      goToNextStep,
      goToPreviousStep,
    }),
    [
      selectedPurposeId,
      handleSelectedPurposeIdChange,
      selectedKeyId,
      handleSelectedKeyIdChange,
      clientId,
      goToNextStep,
      goToPreviousStep,
    ]
  )

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useVoucherInstructionsContext, VoucherInstructionsContextProvider }
