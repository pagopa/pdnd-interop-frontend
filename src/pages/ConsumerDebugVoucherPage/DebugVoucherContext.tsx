import React, { useCallback } from 'react'
import { createContext } from '@/utils/common.utils'
import {
  AccessTokenRequest,
  TokenGenerationValidationEntry,
  TokenGenerationValidationResult,
  TokenGenerationValidationSteps,
} from '@/api/api.generatedTypes'

type DebugVoucherContextType = {
  request: AccessTokenRequest
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
  goToNextStep: VoidFunction
  handleMakeNewRequest: VoidFunction
}

const { useContext, Provider } = createContext<DebugVoucherContextType>(
  'DebugVoucherContext',
  {} as DebugVoucherContextType
)

type DebugVoucherContextProviderProps = {
  children: React.ReactNode
  request: AccessTokenRequest
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

  /**
   * Based on the current selectedStep key we know which is the subsequent step key
   * and when we change the debugVoucherStepDrawer selectedStep value we use the steps value from response
   */
  const goToNextStep = useCallback(() => {
    setDebugVoucherStepDrawer((prev) => {
      switch (prev.selectedStep?.[0]) {
        case 'clientAssertionValidation':
          return {
            ...prev,
            selectedStep: ['publicKeyRetrieve', response?.steps.publicKeyRetrieve],
          }
        case 'publicKeyRetrieve':
          return {
            ...prev,
            selectedStep: [
              'clientAssertionSignatureVerification',
              response?.steps.clientAssertionSignatureVerification,
            ],
          }
        case 'clientAssertionSignatureVerification':
          if (response.clientKind === 'CONSUMER') {
            return {
              ...prev,
              selectedStep: [
                'platformStatesVerification',
                response.steps.platformStatesVerification,
              ],
            }
          }
        case 'platformStatesVerification':
        default:
          return prev
      }
    })
  }, [
    response.clientKind,
    response.steps.clientAssertionSignatureVerification,
    response.steps.platformStatesVerification,
    response.steps.publicKeyRetrieve,
  ])

  const handleMakeNewRequest = useCallback(() => {
    onResetDebugVoucherValues()
  }, [onResetDebugVoucherValues])

  const providerValue = React.useMemo(() => {
    return {
      request,
      response,
      debugVoucherStepDrawer,
      setDebugVoucherStepDrawer,
      goToNextStep,
      handleMakeNewRequest,
    }
  }, [debugVoucherStepDrawer, goToNextStep, handleMakeNewRequest, request, response])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useDebugVoucherContext, DebugVoucherContextProvider }
