import React from 'react'
import { DebugVoucherContextProvider, useDebugVoucherContext } from '../DebugVoucherContext'
import {
  createMockDebugVoucherRequest,
  createMockDebugVoucherResultFailed,
  createMockDebugVoucherResultPassed,
  createMockDebugVoucherResultStep,
} from '__mocks__/data/voucher.mocks'
import { vi } from 'vitest'
import { renderHook } from '@testing-library/react'

describe('DebugVoucherContext testing', () => {
  it('should change the selectedStep from clientAssertionValidation to publicKeyRetrieve', async () => {
    const { result, rerender } = renderHook(() => useDebugVoucherContext(), {
      wrapper: ({ children }) => (
        <DebugVoucherContextProvider
          request={createMockDebugVoucherRequest()}
          response={createMockDebugVoucherResultPassed()}
          onResetDebugVoucherValues={vi.fn()}
        >
          {children}
        </DebugVoucherContextProvider>
      ),
    })
    result.current.setDebugVoucherStepDrawer({
      isOpen: false,
      selectedStep: ['clientAssertionValidation', createMockDebugVoucherResultStep()],
    })

    rerender()

    result.current.goToNextStep()

    rerender()

    expect(result.current.debugVoucherStepDrawer.selectedStep).toEqual([
      'publicKeyRetrieve',
      {
        result: 'PASSED',
        failures: [],
      },
    ])
  })

  it('should change the selectedStep from publicKeyRetrieve to clientAssertionSignatureVerification', async () => {
    const { result, rerender } = renderHook(() => useDebugVoucherContext(), {
      wrapper: ({ children }) => (
        <DebugVoucherContextProvider
          request={createMockDebugVoucherRequest()}
          response={createMockDebugVoucherResultPassed()}
          onResetDebugVoucherValues={vi.fn()}
        >
          {children}
        </DebugVoucherContextProvider>
      ),
    })
    result.current.setDebugVoucherStepDrawer({
      isOpen: false,
      selectedStep: ['publicKeyRetrieve', createMockDebugVoucherResultStep()],
    })

    rerender()

    result.current.goToNextStep()

    rerender()

    expect(result.current.debugVoucherStepDrawer.selectedStep).toEqual([
      'clientAssertionSignatureVerification',
      {
        result: 'PASSED',
        failures: [],
      },
    ])
  })

  it('should change the selectedStep from clientAssertionSignatureVerification to platformStatesVerification if clientKind is CONSUMER', async () => {
    const { result, rerender } = renderHook(() => useDebugVoucherContext(), {
      wrapper: ({ children }) => (
        <DebugVoucherContextProvider
          request={createMockDebugVoucherRequest()}
          response={createMockDebugVoucherResultPassed({ clientKind: 'CONSUMER' })}
          onResetDebugVoucherValues={vi.fn()}
        >
          {children}
        </DebugVoucherContextProvider>
      ),
    })
    result.current.setDebugVoucherStepDrawer({
      isOpen: false,
      selectedStep: ['clientAssertionSignatureVerification', createMockDebugVoucherResultStep()],
    })

    rerender()

    result.current.goToNextStep()

    rerender()

    expect(result.current.debugVoucherStepDrawer.selectedStep).toEqual([
      'platformStatesVerification',
      {
        result: 'PASSED',
        failures: [],
      },
    ])
  })

  it('should not change the selectedStep from clientAssertionSignatureVerification to platformStatesVerification if clientKind is API', async () => {
    const { result, rerender } = renderHook(() => useDebugVoucherContext(), {
      wrapper: ({ children }) => (
        <DebugVoucherContextProvider
          request={createMockDebugVoucherRequest()}
          response={createMockDebugVoucherResultPassed({
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
          })}
          onResetDebugVoucherValues={vi.fn()}
        >
          {children}
        </DebugVoucherContextProvider>
      ),
    })
    result.current.setDebugVoucherStepDrawer({
      isOpen: false,
      selectedStep: [
        'clientAssertionSignatureVerification',
        createMockDebugVoucherResultStep({ result: 'PASSED', failures: [] }),
      ],
    })

    rerender()

    result.current.goToNextStep()

    rerender()

    expect(result.current.debugVoucherStepDrawer.selectedStep).toEqual([
      'clientAssertionSignatureVerification',
      {
        result: 'PASSED',
        failures: [],
      },
    ])
  })

  it('should not change the selectedStep from clientAssertionSignatureVerification to platformStatesVerification if clientKind is undefined', async () => {
    const { result, rerender } = renderHook(() => useDebugVoucherContext(), {
      wrapper: ({ children }) => (
        <DebugVoucherContextProvider
          request={createMockDebugVoucherRequest()}
          response={createMockDebugVoucherResultFailed({
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
          })}
          onResetDebugVoucherValues={vi.fn()}
        >
          {children}
        </DebugVoucherContextProvider>
      ),
    })
    result.current.setDebugVoucherStepDrawer({
      isOpen: false,
      selectedStep: [
        'clientAssertionSignatureVerification',
        createMockDebugVoucherResultStep({ result: 'SKIPPED', failures: [] }),
      ],
    })

    rerender()

    result.current.goToNextStep()

    rerender()

    expect(result.current.debugVoucherStepDrawer.selectedStep).toEqual([
      'clientAssertionSignatureVerification',
      {
        result: 'SKIPPED',
        failures: [],
      },
    ])
  })

  it('should not change the selectedStep when it is platformStatesVerification', async () => {
    const { result, rerender } = renderHook(() => useDebugVoucherContext(), {
      wrapper: ({ children }) => (
        <DebugVoucherContextProvider
          request={createMockDebugVoucherRequest()}
          response={createMockDebugVoucherResultPassed()}
          onResetDebugVoucherValues={vi.fn()}
        >
          {children}
        </DebugVoucherContextProvider>
      ),
    })
    result.current.setDebugVoucherStepDrawer({
      isOpen: false,
      selectedStep: [
        'platformStatesVerification',
        createMockDebugVoucherResultStep({ result: 'PASSED', failures: [] }),
      ],
    })

    rerender()

    result.current.goToNextStep()

    rerender()

    expect(result.current.debugVoucherStepDrawer.selectedStep).toEqual([
      'platformStatesVerification',
      {
        result: 'PASSED',
        failures: [],
      },
    ])
  })
})
