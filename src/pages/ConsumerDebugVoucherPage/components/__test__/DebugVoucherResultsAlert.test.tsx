import React from 'react'
import { mockDebugVoucherContext } from './test.commons'
import {
  createMockDebugVoucherRequest,
  createMockDebugVoucherResultFailed,
  createMockDebugVoucherResultPassed,
} from '@/../__mocks__/data/voucher.mocks'
import DebugVoucherResultsAlert from '../DebugVoucherResultsAlert'
import { render } from '@testing-library/react'

describe('DebugVoucherResultsAlert testing', () => {
  it('should render correctly if result is failed', () => {
    mockDebugVoucherContext({ response: createMockDebugVoucherResultFailed() })

    const screen = render(<DebugVoucherResultsAlert />)

    expect(screen.getByText('alert.description.failed')).toBeInTheDocument()
  })

  it('should render correctly if result is passed and clientKind is API', () => {
    mockDebugVoucherContext({
      request: {
        ...createMockDebugVoucherRequest(),
        dpop_proof: 'mock dpop proof',
      },
      response: createMockDebugVoucherResultPassed({
        clientKind: 'API',
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
            result: 'SKIPPED',
            failures: [],
          },
          dpopValidation: {
            result: 'SKIPPED',
            failures: [],
          },
        },
        eservice: undefined,
      }),
    })

    const screen = render(<DebugVoucherResultsAlert />)

    expect(screen.getByText('alert.description.apiV3Success')).toBeInTheDocument()
  })

  it('should render correctly if result is passed and clientKind is CONSUMER', () => {
    mockDebugVoucherContext({ response: createMockDebugVoucherResultPassed() })

    const screen = render(<DebugVoucherResultsAlert />)

    expect(screen.getByText('alert.description.consumerSuccess')).toBeInTheDocument()
  })
})
