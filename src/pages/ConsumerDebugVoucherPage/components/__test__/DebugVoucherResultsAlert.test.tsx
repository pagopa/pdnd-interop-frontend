import React from 'react'
import { mockDebugVoucherContext } from './test.commons'
import {
  createMockDebugVoucherResultFailed,
  createMockDebugVoucherResultPassed,
} from '@/../__mocks__/data/voucher.mocks'
import DebugVoucherResultsAlert from '../DebugVoucherResultsAlert'
import { render } from '@testing-library/react'

describe('DebugVoucherResultsAlert testing', () => {
  it('should match snapshot if result is failed', () => {
    mockDebugVoucherContext({ response: createMockDebugVoucherResultFailed() })

    const screen = render(<DebugVoucherResultsAlert />)

    expect(screen.getByText('alert.description.failed')).toBeInTheDocument()

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if result is passed and clientKind is API', () => {
    mockDebugVoucherContext({
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
        },
        eservice: undefined,
      }),
    })

    const screen = render(<DebugVoucherResultsAlert />)

    expect(screen.getByText('alert.description.apiSuccess')).toBeInTheDocument()

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if result is passed and clientKind is CONSUMER', () => {
    mockDebugVoucherContext({ response: createMockDebugVoucherResultPassed() })

    const screen = render(<DebugVoucherResultsAlert />)

    expect(screen.getByText('alert.description.consumerSuccess')).toBeInTheDocument()

    expect(screen.baseElement).toMatchSnapshot()
  })
})
