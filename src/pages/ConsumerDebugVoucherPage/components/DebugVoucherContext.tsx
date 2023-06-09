import React, { useCallback } from 'react'
import { createContext } from '@/utils/common.utils'
import type {
  TokenGenerationValidationEntry,
  TokenGenerationValidationRequest,
  TokenGenerationValidationResult,
  TokenGenerationValidationSteps,
} from '../types/debug-voucher.types'

type DebugVoucherContextType = {
  request: TokenGenerationValidationRequest
  response: TokenGenerationValidationResult
  debugVoucherStepDrawer: {
    isOpen: boolean
    selectedStep?: [keyof TokenGenerationValidationSteps, TokenGenerationValidationEntry]
  }
  setDebugVoucherStepDrawer: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean
      selectedStep?:
        | [keyof TokenGenerationValidationSteps, TokenGenerationValidationEntry]
        | undefined
    }>
  >
  nextStep: VoidFunction
  handleMakeNewRequest: VoidFunction
}

const { useContext, Provider } = createContext<DebugVoucherContextType>(
  'DebugVoucherContext',
  {} as DebugVoucherContextType
)

type DebugVoucherContextProviderProps = {
  children: React.ReactNode
  request: TokenGenerationValidationRequest
  response: TokenGenerationValidationResult
  onResetDebugVoucherValues: VoidFunction
}

const DebugVoucherContextProvider: React.FC<DebugVoucherContextProviderProps> = ({
  children,
  request,
  response,
  onResetDebugVoucherValues,
}) => {
  const [debugVoucherStepDrawer, setDebugVoucherStepDrawer] = React.useState<{
    isOpen: boolean
    selectedStep?: [keyof TokenGenerationValidationSteps, TokenGenerationValidationEntry]
  }>({ isOpen: false, selectedStep: undefined })

  const nextStep = useCallback(() => {
    if (response) {
      switch (debugVoucherStepDrawer.selectedStep?.[0]) {
        case 'clientAssertionValidation':
          setDebugVoucherStepDrawer((prev) => ({
            ...prev,
            selectedStep: ['publicKeyRetrieve', response?.steps.publicKeyRetrieve],
          }))
          break
        case 'publicKeyRetrieve':
          setDebugVoucherStepDrawer((prev) => ({
            ...prev,
            selectedStep: [
              'clientAssertionSignatureVerification',
              response?.steps.clientAssertionSignatureVerification,
            ],
          }))
          break
        case 'clientAssertionSignatureVerification':
          if (response.clientKind === 'CONSUMER') {
            setDebugVoucherStepDrawer((prev) => ({
              ...prev,
              selectedStep: [
                'platformStatesVerification',
                response.steps.platformStatesVerification,
              ],
            }))
          }
          break
        case 'platformStatesVerification':
        default:
          break
      }
    }
  }, [debugVoucherStepDrawer.selectedStep, response])

  const handleMakeNewRequest = useCallback(() => {
    onResetDebugVoucherValues()
  }, [onResetDebugVoucherValues])

  const providerValue = React.useMemo(() => {
    return {
      request,
      response,
      debugVoucherStepDrawer,
      setDebugVoucherStepDrawer,
      nextStep,
      handleMakeNewRequest,
    }
  }, [debugVoucherStepDrawer, handleMakeNewRequest, nextStep, request, response])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useDebugVoucherContext, DebugVoucherContextProvider }
