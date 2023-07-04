import React from 'react'
import { mockDebugVoucherContext } from './test.commons'
import { vi } from 'vitest'
import { DebugVoucherResults } from '../DebugVoucherResults'
import { fireEvent, render } from '@testing-library/react'
import {
  createMockDebugVoucherRequest,
  createMockDebugVoucherResultFailed,
  createMockDebugVoucherResultPassed,
  createMockDebugVoucherResultStep,
} from '__mocks__/data/voucher.mocks'

describe('DebugVoucherResults testing', () => {
  it('should match snapshot if isOpen is false', () => {
    mockDebugVoucherContext({
      request: createMockDebugVoucherRequest(),
      response: createMockDebugVoucherResultPassed(),
      debugVoucherStepDrawer: { isOpen: false, selectedStep: undefined },
    })

    const screen = render(<DebugVoucherResults />)

    expect(screen.queryByText('stepDrawer.stepResultLabel')).not.toBeInTheDocument()

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if isOpen is true', () => {
    mockDebugVoucherContext({
      response: createMockDebugVoucherResultPassed(),
      request: createMockDebugVoucherRequest(),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherResults />)

    expect(screen.queryByText('stepDrawer.stepResultLabel')).toBeInTheDocument()

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should handleMakeNewRequestMockFn function be called when newRequestButton is clicked', () => {
    const handleMakeNewRequestMockFn = vi.fn()
    mockDebugVoucherContext({
      request: createMockDebugVoucherRequest(),
      response: createMockDebugVoucherResultPassed(),
      debugVoucherStepDrawer: { isOpen: false, selectedStep: undefined },
      handleMakeNewRequest: handleMakeNewRequestMockFn,
    })

    const screen = render(<DebugVoucherResults />)

    const newRequestButton = screen.getByRole('button', { name: 'newRequestBtn' })

    expect(newRequestButton).toBeInTheDocument()

    fireEvent.click(newRequestButton)

    expect(handleMakeNewRequestMockFn).toBeCalled()
  })

  it('should setDebugVoucherStepDrawer function be called if close icon is clicked', () => {
    const setDebugVoucherStepDrawerMockFn = vi.fn()

    mockDebugVoucherContext({
      request: createMockDebugVoucherRequest(),
      response: createMockDebugVoucherResultPassed(),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
      },
      setDebugVoucherStepDrawer: setDebugVoucherStepDrawerMockFn,
    })

    const screen = render(<DebugVoucherResults />)

    const closeDrawerButton = screen.getByLabelText('closeIconAriaLabel')

    fireEvent.click(closeDrawerButton)

    expect(setDebugVoucherStepDrawerMockFn).toBeCalled()
  })

  it('should button nextStep not be rendered if clientKind is CONUSMER and selectedStep key is platformStatesVerification', () => {
    mockDebugVoucherContext({
      request: createMockDebugVoucherRequest(),
      response: createMockDebugVoucherResultPassed({ clientKind: 'CONSUMER' }),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['platformStatesVerification', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherResults />)

    expect(screen.queryByRole('button', { name: 'stepDrawer.nextStepBtn' })).not.toBeInTheDocument()
  })

  it('should button nextStep not be rendered if clientKind is API and selectedStep key is clientAssertionSignatureVerification', () => {
    mockDebugVoucherContext({
      request: createMockDebugVoucherRequest(),
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

    const screen = render(<DebugVoucherResults />)

    expect(screen.queryByRole('button', { name: 'stepDrawer.nextStepBtn' })).not.toBeInTheDocument()
  })

  it('should button nextStep not be rendered if clientKind is undefined and selectedStep key is clientAssertionSignatureVerification', () => {
    mockDebugVoucherContext({
      request: createMockDebugVoucherRequest(),
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

    const screen = render(<DebugVoucherResults />)

    expect(
      screen.getByText('stepDrawer.title.clientAssertionSignatureVerification')
    ).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: 'stepDrawer.nextStepBtn' })).not.toBeInTheDocument()
  })

  it('should button nextStep be rendered if clientKind is CONUSMER and selectedStep key is not platformStatesVerification', () => {
    mockDebugVoucherContext({
      request: createMockDebugVoucherRequest(),
      response: createMockDebugVoucherResultPassed({ clientKind: 'CONSUMER' }),
      debugVoucherStepDrawer: {
        isOpen: true,
        selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
      },
    })

    const screen = render(<DebugVoucherResults />)

    expect(screen.getByText('stepDrawer.title.clientAssertionValidation')).toBeInTheDocument()

    screen.debug()

    expect(screen.queryByRole('button', { name: 'stepDrawer.nextStepBtn' })).toBeInTheDocument()
  })

  // it('should button nextStep be rendered if clientKind is API and selectedStep key is not clientAssertionSignatureVerification', () => {
  //   mockDebugVoucherContext({
  //     request: createMockDebugVoucherRequest(),
  //     response: createMockDebugVoucherResultPassed({
  //       clientKind: 'API',
  //       eservice: undefined,
  //       steps: {
  //         clientAssertionValidation: {
  //           result: 'PASSED',
  //           failures: [],
  //         },
  //         publicKeyRetrieve: {
  //           result: 'PASSED',
  //           failures: [],
  //         },
  //         clientAssertionSignatureVerification: {
  //           result: 'PASSED',
  //           failures: [],
  //         },
  //         platformStatesVerification: {
  //           result: 'SKIPPED',
  //           failures: [],
  //         },
  //       },
  //     }),
  //     debugVoucherStepDrawer: {
  //       isOpen: true,
  //       selectedStep: ['publicKeyRetrieve', createMockDebugVoucherResultStep()],
  //     },
  //   })

  //   const screen = render(<DebugVoucherResults />)

  //   expect(screen.getByRole('button', { name: 'stepDrawer.nextStepBtn' })).toBeInTheDocument()
  // })

  // it('should button nextStep be rendered if clientKind is undefined and selectedStep key is not clientAssertionSignatureVerification', () => {
  //   mockDebugVoucherContext({
  //     request: createMockDebugVoucherRequest(),
  //     response: createMockDebugVoucherResultFailed({
  //       clientKind: undefined,
  //       eservice: undefined,
  //       steps: {
  //         clientAssertionValidation: {
  //           result: 'FAILED',
  //           failures: [
  //             {
  //               code: 'test code',
  //               reason: 'test reason',
  //             },
  //           ],
  //         },
  //         publicKeyRetrieve: {
  //           result: 'SKIPPED',
  //           failures: [],
  //         },
  //         clientAssertionSignatureVerification: {
  //           result: 'SKIPPED',
  //           failures: [],
  //         },
  //         platformStatesVerification: {
  //           result: 'SKIPPED',
  //           failures: [],
  //         },
  //       },
  //     }),
  //     debugVoucherStepDrawer: {
  //       isOpen: true,
  //       selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
  //     },
  //   })

  //   const screen = render(<DebugVoucherResults />)

  //   expect(screen.getByText('stepDrawer.title.clientAssertionValidation')).toBeInTheDocument()

  //   expect(screen.queryByRole('button', { name: 'stepDrawer.nextStepBtn' })).toBeInTheDocument()
  // })

  // it('should nextStep function be called on nextStepButton click', () => {
  //   const goToNextStepMockFn = vi.fn()
  //   mockDebugVoucherContext({
  //     response: createMockDebugVoucherResultPassed({ clientKind: 'CONSUMER' }),
  //     debugVoucherStepDrawer: {
  //       isOpen: true,
  //       selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
  //     },
  //     goToNextStep: goToNextStepMockFn,
  //   })

  //   const screen = render(<DebugVoucherStepDrawer />)

  //   const nextStepButton = screen.getByRole('button', { name: 'stepDrawer.nextStepBtn' })

  //   fireEvent.click(nextStepButton)

  //   expect(goToNextStepMockFn).toBeCalled()
  // })
})
