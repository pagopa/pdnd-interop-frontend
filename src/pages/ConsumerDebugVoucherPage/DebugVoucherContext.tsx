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

  const handleMakeNewRequest = useCallback(() => {
    onResetDebugVoucherValues()
  }, [onResetDebugVoucherValues])

  const stepOrder: readonly (keyof TokenGenerationValidationSteps)[] = React.useMemo(() => {
    return [
      'clientAssertionValidation',
      'publicKeyRetrieve',
      'clientAssertionSignatureVerification',
      ...(response.clientKind === 'CONSUMER' ? (['platformStatesVerification'] as const) : []),
      ...(response.steps.dpopValidation ? (['dpopValidation'] as const) : []),
    ]
  }, [response.clientKind, response.steps.dpopValidation])

  const goToNextStep = useCallback(() => {
    setDebugVoucherStepDrawer((prev) => {
      const current = prev.selectedStep?.[0]
      if (!current) return prev
      const idx = stepOrder.indexOf(current)
      if (idx < 0 || idx >= stepOrder.length - 1) return prev
      const nextKey = stepOrder[idx + 1]
      const nextStep = response.steps[nextKey]
      return nextStep ? { ...prev, selectedStep: [nextKey, nextStep] } : prev
    })
  }, [stepOrder, response.steps])

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
