import type { ClientKind } from '@/api/api.generatedTypes'

export type TokenGenerationValidationRequest = {
  client_id?: string
  client_assertion: string
  client_assertion_type: string
  grant_type: string
}

export type TokenGenerationValidationResult = {
  clientKind?: ClientKind
  steps: TokenGenerationValidationSteps
  eservice?: TokenGenerationValidationEService
}

export type TokenGenerationValidationSteps = {
  clientAssertionValidation: TokenGenerationValidationEntry
  publicKeyRetrieve: TokenGenerationValidationEntry
  clientAssertionSignatureVerification: TokenGenerationValidationEntry
  platformStatesVerification: TokenGenerationValidationEntry
}

export type TokenGenerationValidationEntry = {
  result: TokenGenerationValidationStepResult
  failures: Array<TokenGenerationValidationStepFailure>
}

export type TokenGenerationValidationStepResult = 'PASSED' | 'SKIPPED' | 'FAILED'

export type TokenGenerationValidationStepFailure = {
  code: string
  reason: string
}

export type TokenGenerationValidationEService = {
  id: string
  descriptorId: string
  version: string
  name: string
}
