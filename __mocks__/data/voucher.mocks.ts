import { createMockFactory } from '../../src/utils/testing.utils'
import type {
  TokenGenerationValidationRequest,
  TokenGenerationValidationEntry,
  TokenGenerationValidationResult,
} from '../../src/pages/ConsumerDebugVoucherPage/types/debug-voucher.types'

const createMockDebugVoucherRequest = createMockFactory<TokenGenerationValidationRequest>({
  client_id: 'test request client id',
  client_assertion: 'test request client assertion',
  client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
  grant_type: 'client_credentials',
})

const createMockDebugVoucherResultStep = createMockFactory<TokenGenerationValidationEntry>({
  result: 'FAILED',
  failures: [
    {
      code: '8001',
      reason: 'test failure reason with localized string message',
    },
    {
      code: '8004',
      reason: 'test failure reason without localized string message',
    },
  ],
})

const createMockDebugVoucherResultPassed = createMockFactory<TokenGenerationValidationResult>({
  clientKind: 'CONSUMER',
  steps: {
    clientAssertionValidation: {
      result: 'PASSED',
      failures: [],
    },
    publicKeyRetrieve: {
      result: 'PASSED',
      failures: [],
    },
    clientAssertionSignatureVerification: {
      result: 'PASSED',
      failures: [],
    },
    platformStatesVerification: {
      result: 'PASSED',
      failures: [],
    },
  },
  eservice: {
    id: 'id test',
    descriptorId: 'descriptor id test',
    version: 'version test',
    name: 'name test',
  },
})

const createMockDebugVoucherResultFailed = createMockFactory<TokenGenerationValidationResult>({
  clientKind: 'API',
  steps: {
    clientAssertionValidation: {
      result: 'PASSED',
      failures: [],
    },
    publicKeyRetrieve: {
      result: 'FAILED',
      failures: [
        {
          code: '8001',
          reason: 'test failure reason with localized string message',
        },
        {
          code: '8004',
          reason: 'test failure reason without localized string message',
        },
      ],
    },
    clientAssertionSignatureVerification: {
      result: 'SKIPPED',
      failures: [],
    },
    platformStatesVerification: {
      result: 'SKIPPED',
      failures: [],
    },
  },
})

export {
  createMockDebugVoucherRequest,
  createMockDebugVoucherResultStep,
  createMockDebugVoucherResultPassed,
  createMockDebugVoucherResultFailed,
}
