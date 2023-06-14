import {
  createMockDebugVoucherResultFailed,
  createMockDebugVoucherResultPassed,
  createMockDebugVoucherResultStep,
} from '__mocks__/data/voucher.mocks'
import React from 'react'
import { mockDebugVoucherContext } from './test.commons'
import { fireEvent, render } from '@testing-library/react'
import DebugVoucherStepDrawer from '../DebugVoucherStepDrawer'
import { vi } from 'vitest'

describe('DebugVoucherStepDrawer testing', () => {
  it('should match snapshot if isOpen is false', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultPassed(),
      debugVoucherStepDrawer: {
        isOpen: false,
        selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherStepDrawer />)

    expect(screen.queryByLabelText('closeIconBtn.aria-label')).not.toBeInTheDocument()

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if isOpen is true', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultPassed(),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherStepDrawer />)

    expect(screen.getByLabelText('closeIconBtn.aria-label')).toBeInTheDocument()

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should setDebugVoucherStepDrawer function be called if close icon is clicked', () => {
    const setDebugVoucherStepDrawerMockFn = vi.fn()

    mockDebugVoucherContext({
      response: createMockDebugVoucherResultPassed(),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
      },
      setDebugVoucherStepDrawer: setDebugVoucherStepDrawerMockFn,
    })

    const screen = render(<DebugVoucherStepDrawer />)

    const closeDrawerButton = screen.getByLabelText('closeIconBtn.aria-label')

    fireEvent.click(closeDrawerButton)

    expect(setDebugVoucherStepDrawerMockFn).toBeCalled()
  })

  it('should button nextStep not be rendered if clientKind is CONUSMER and selectedStep key is platformStatesVerification', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultPassed({ clientKind: 'CONSUMER' }),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['platformStatesVerification', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherStepDrawer />)

    expect(screen.queryByRole('button', { name: 'stepDrawer.nextStepBtn' })).not.toBeInTheDocument()
  })

  it('should button nextStep not be rendered if clientKind is API and selectedStep key is clientAssertionSignatureVerification', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultPassed({
        clientKind: 'API',
        eservice: undefined,
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
      }),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionSignatureVerification', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherStepDrawer />)

    expect(screen.queryByRole('button', { name: 'stepDrawer.nextStepBtn' })).not.toBeInTheDocument()
  })

  it('should button nextStep not be rendered if clientKind is undefined and selectedStep key is clientAssertionSignatureVerification', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultFailed({
        clientKind: undefined,
        eservice: undefined,
        steps: {
          clientAssertionValidation: {
            result: 'FAILED',
            failures: [
              {
                code: 'test code',
                reason: 'test reason',
              },
            ],
          },
          publicKeyRetrieve: {
            result: 'SKIPPED',
            failures: [],
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
      }),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionSignatureVerification', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherStepDrawer />)

    expect(screen.queryByRole('button', { name: 'stepDrawer.nextStepBtn' })).not.toBeInTheDocument()
  })

  it('should button nextStep be rendered if clientKind is CONUSMER and selectedStep key is not platformStatesVerification', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultPassed({ clientKind: 'CONSUMER' }),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherStepDrawer />)

    expect(screen.queryByRole('button', { name: 'stepDrawer.nextStepBtn' })).toBeInTheDocument()
  })

  it('should button nextStep be rendered if clientKind is API and selectedStep key is not clientAssertionSignatureVerification', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultPassed({
        clientKind: 'API',
        eservice: undefined,
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
      }),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['publicKeyRetrieve', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherStepDrawer />)

    expect(screen.queryByRole('button', { name: 'stepDrawer.nextStepBtn' })).toBeInTheDocument()
  })

  it('should button nextStep be rendered if clientKind is undefined and selectedStep key is not clientAssertionSignatureVerification', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultFailed({
        clientKind: undefined,
        eservice: undefined,
        steps: {
          clientAssertionValidation: {
            result: 'FAILED',
            failures: [
              {
                code: 'test code',
                reason: 'test reason',
              },
            ],
          },
          publicKeyRetrieve: {
            result: 'SKIPPED',
            failures: [],
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
      }),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherStepDrawer />)

    expect(screen.queryByRole('button', { name: 'stepDrawer.nextStepBtn' })).toBeInTheDocument()
  })

  it('should nextStep function be called on nextStepButton click', () => {
    const goToNextStepMockFn = vi.fn()
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultPassed({ clientKind: 'CONSUMER' }),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
      },
      goToNextStep: goToNextStepMockFn,
    })

    const screen = render(<DebugVoucherStepDrawer />)

    const nextStepButton = screen.getByRole('button', { name: 'stepDrawer.nextStepBtn' })

    fireEvent.click(nextStepButton)

    expect(goToNextStepMockFn).toBeCalled()
  })
})
