import React from 'react'
import { mockDebugVoucherContext } from './test.commons'
import {
  createMockDebugVoucherResultFailed,
  createMockDebugVoucherResultPassed,
} from '@/../__mocks__/data/voucher.mocks'
import { DebugVoucherResultsStepsSection } from '../DebugVoucherResultsStepsSection'
import { render } from '@testing-library/react'

describe('DebugVoucherResultsStepsSection testing', () => {
  it('should match snapshot if result is failed and clientKind is undefined', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultFailed({ clientKind: undefined }),
    })

    const screen = render(<DebugVoucherResultsStepsSection />)

    expect(screen.queryAllByText('chipLabel.passed').length).toBe(1)
    expect(screen.queryAllByText('chipLabel.failed').length).toBe(1)
    expect(screen.queryAllByText('chipLabel.skipped').length).toBe(1)

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if result is failed and clientKind is API', () => {
    mockDebugVoucherContext({ response: createMockDebugVoucherResultFailed() })

    const screen = render(<DebugVoucherResultsStepsSection />)

    expect(screen.queryAllByText('chipLabel.passed').length).toBe(1)
    expect(screen.queryAllByText('chipLabel.failed').length).toBe(1)
    expect(screen.queryAllByText('chipLabel.skipped').length).toBe(1)

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if result is failed and clientKind is CONSUMER', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultFailed({ clientKind: 'CONSUMER' }),
    })

    const screen = render(<DebugVoucherResultsStepsSection />)

    expect(screen.queryAllByText('chipLabel.passed').length).toBe(1)
    expect(screen.queryAllByText('chipLabel.failed').length).toBe(1)
    expect(screen.queryAllByText('chipLabel.skipped').length).toBe(2)

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

    const screen = render(<DebugVoucherResultsStepsSection />)

    expect(screen.queryAllByText('chipLabel.passed').length).toBe(3)
    expect(screen.queryAllByText('chipLabel.failed').length).toBe(0)
    expect(screen.queryAllByText('chipLabel.skipped').length).toBe(0)

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if result is passed and clientKind is CONSUMER', () => {
    mockDebugVoucherContext({ response: createMockDebugVoucherResultPassed() })

    const screen = render(<DebugVoucherResultsStepsSection />)

    expect(screen.queryAllByText('chipLabel.passed').length).toBe(4)
    expect(screen.queryAllByText('chipLabel.failed').length).toBe(0)
    expect(screen.queryAllByText('chipLabel.skipped').length).toBe(0)

    expect(screen.baseElement).toMatchSnapshot()
  })
})
