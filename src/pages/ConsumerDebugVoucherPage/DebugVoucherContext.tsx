import React, { useCallback } from 'react'
import { createContext } from '@/utils/common.utils'
import type {
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
  stepOrder: readonly (keyof TokenGenerationValidationSteps)[]
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
          } else if (response.clientKind === 'API' && response.steps.dpopValidation) {
            return {
              ...prev,
              selectedStep: ['dpopValidation', response.steps.dpopValidation],
            }
          }
        case 'platformStatesVerification':
          if (response.steps.dpopValidation) {
            return {
              ...prev,
              selectedStep: ['dpopValidation', response.steps.dpopValidation],
            }
          }
        case 'dpopValidation':
        default:
          return prev
      }
    })
  }, [
    response.clientKind,
    response.steps.clientAssertionSignatureVerification,
    response.steps.dpopValidation,
    response.steps.platformStatesVerification,
    response.steps.publicKeyRetrieve,
  ])

  const handleMakeNewRequest = useCallback(() => {
    onResetDebugVoucherValues()
  }, [onResetDebugVoucherValues])

  const stepOrder = React.useMemo(() => {
    return [
      'clientAssertionValidation',
      'publicKeyRetrieve',
      'clientAssertionSignatureVerification',
      ...(response.clientKind === 'CONSUMER' ? (['platformStatesVerification'] as const) : []),
      ...(response.steps.dpopValidation ? (['dpopValidation'] as const) : []),
    ] as const
  }, [response.clientKind, response.steps.dpopValidation])

  const providerValue = React.useMemo(() => {
    return {
      request,
      response,
      debugVoucherStepDrawer,
      stepOrder,
      setDebugVoucherStepDrawer,
      goToNextStep,
      handleMakeNewRequest,
    }
  }, [debugVoucherStepDrawer, goToNextStep, handleMakeNewRequest, request, response, stepOrder])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useDebugVoucherContext, DebugVoucherContextProvider }
