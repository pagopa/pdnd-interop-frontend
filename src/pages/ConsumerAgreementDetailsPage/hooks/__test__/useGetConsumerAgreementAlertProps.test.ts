import type { Agreement, Purpose } from '@/api/api.generatedTypes'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { useGetConsumerAgreementAlertProps } from '../useGetConsumerAgreementAlertProps'
import { createMockAgreement } from '../../../../../__mocks__/data/agreement.mocks'
import { waitFor } from '@testing-library/react'
import type { Mock } from 'vitest'
import { createMockPurpose } from '../../../../../__mocks__/data/purpose.mocks'

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: vi.fn(),
  useQueries: vi.fn(),
}))

import { useQuery } from '@tanstack/react-query'

const mockUseGetConsumersList = (purposes: Array<Purpose>) => {
  ;(useQuery as Mock).mockReturnValue({
    data: {
      results: purposes,
      pagination: {
        limit: 50,
        offset: 0,
        totalCount: purposes.length,
      },
    },
  })
}

function renderUseGetConsumerAgreementAlertPropsHook(agreementMock: Agreement) {
  return renderHookWithApplicationContext(() => useGetConsumerAgreementAlertProps(agreementMock), {
    withReactQueryContext: true,
  })
}

describe('check if useGetConsumerAgreementAlertProps returns the correct alertProps based on the passed agreement - no agreement', () => {
  it('shoud return the correct alertProps if suspended agreement with suspendedByProducer is given', () => {
    mockUseGetConsumersList([])
    const agreement = createMockAgreement({
      state: 'SUSPENDED',
      suspendedByProducer: true,
      suspendedByConsumer: false,
      suspendedByPlatform: false,
    })
    const { result } = renderUseGetConsumerAgreementAlertPropsHook(agreement)
    expect(result.current?.severity).toBe('error')
    expect(result.current?.content).toBe('consumerRead.suspendedAlert.byProducer')
  })

  it('shoud return the correct alertProps if suspended agreement with suspendedByConsumer is given', () => {
    const agreement = createMockAgreement({
      state: 'SUSPENDED',
      suspendedByProducer: false,
      suspendedByConsumer: true,
      suspendedByPlatform: false,
    })
    const { result } = renderUseGetConsumerAgreementAlertPropsHook(agreement)
    expect(result.current?.severity).toBe('error')
    expect(result.current?.content).toBe('consumerRead.suspendedAlert.byConsumer')
  })

  it('shoud return the correct alertProps if suspended agreement with suspendedByPlatform is given', () => {
    const agreement = createMockAgreement({
      state: 'SUSPENDED',
      suspendedByProducer: false,
      suspendedByConsumer: false,
      suspendedByPlatform: true,
    })
    const { result } = renderUseGetConsumerAgreementAlertPropsHook(agreement)
    expect(result.current?.severity).toBe('error')
    expect(result.current?.content).toBe('consumerRead.suspendedAlert.byPlatform')
  })

  it('shoud return the correct alertProps if suspended agreement with every suspendedBy is given', () => {
    const agreement = createMockAgreement({
      state: 'SUSPENDED',
      suspendedByProducer: true,
      suspendedByConsumer: true,
      suspendedByPlatform: true,
    })
    const { result } = renderUseGetConsumerAgreementAlertPropsHook(agreement)
    expect(result.current?.severity).toBe('error')
    expect(result.current?.content).toBe('consumerRead.suspendedAlert.byProducer')
  })

  it('shoud return the correct alertProps if suspended agreement with only suspendedByProducer and suspendedByPlatform is given', () => {
    const agreement = createMockAgreement({
      state: 'SUSPENDED',
      suspendedByProducer: true,
      suspendedByConsumer: false,
      suspendedByPlatform: true,
    })
    const { result } = renderUseGetConsumerAgreementAlertPropsHook(agreement)
    expect(result.current?.severity).toBe('error')
    expect(result.current?.content).toBe('consumerRead.suspendedAlert.byProducer')
  })

  it('shoud return the correct alertProps if suspended agreement with only suspendedByProducer and suspendedByConsumer is given', () => {
    const agreement = createMockAgreement({
      state: 'SUSPENDED',
      suspendedByProducer: true,
      suspendedByConsumer: true,
      suspendedByPlatform: false,
    })
    const { result } = renderUseGetConsumerAgreementAlertPropsHook(agreement)
    expect(result.current?.severity).toBe('error')
    expect(result.current?.content).toBe('consumerRead.suspendedAlert.byProducer')
  })

  it('shoud return the correct alertProps if suspended agreement with only suspendedByConsumer and suspendedByPlatform is given', () => {
    const agreement = createMockAgreement({
      state: 'SUSPENDED',
      suspendedByProducer: false,
      suspendedByConsumer: true,
      suspendedByPlatform: true,
    })
    const { result } = renderUseGetConsumerAgreementAlertPropsHook(agreement)
    expect(result.current?.severity).toBe('error')
    expect(result.current?.content).toBe('consumerRead.suspendedAlert.byConsumer')
  })

  it('shoud return the correct alertProps if missing certified attributes agreement is given', () => {
    const agreement = createMockAgreement({
      state: 'MISSING_CERTIFIED_ATTRIBUTES',
    })
    const { result } = renderUseGetConsumerAgreementAlertPropsHook(agreement)
    expect(result.current?.severity).toBe('warning')
    expect(result.current?.content).toBe('consumerRead.missingCertifiedAttributesAlert')
  })

  it('shoud return the correct alertProps if nor suspended or missing certified attributes agreement is given and that agreement has not purposes', async () => {
    const agreement = createMockAgreement({
      state: 'ACTIVE',
    })
    mockUseGetConsumersList([])
    const { result } = renderUseGetConsumerAgreementAlertPropsHook(agreement)
    await waitFor(() => {
      expect(result.current?.severity).toBe('info')
      expect(result.current?.content).toBe('consumerRead.noPurposeAlert')
      expect(result.current?.link?.to).toBe('SUBSCRIBE_PURPOSE_CREATE')
    })
  })

  it('shoud return the correct alertProps if nor suspended or missing certified attributes agreement is given and that agreement has only archived purposes', async () => {
    const agreement = createMockAgreement({
      state: 'ACTIVE',
    })
    const purpose = createMockPurpose({
      id: 'test-purpose-1',
      currentVersion: {
        state: 'ARCHIVED',
      },
    })
    const purpose2 = createMockPurpose({
      id: 'test-purpose-2',
      currentVersion: {
        state: 'ARCHIVED',
      },
    })
    mockUseGetConsumersList([purpose, purpose2])
    const { result } = renderUseGetConsumerAgreementAlertPropsHook(agreement)
    await waitFor(() => {
      expect(result.current?.severity).toBe('info')
      expect(result.current?.content).toBe('consumerRead.noPurposeAlert')
      expect(result.current?.link?.to).toBe('SUBSCRIBE_PURPOSE_CREATE')
    })
  })

  it('shoud not return any alertProps if nor suspended or missing certified attributes agreement is given and the agreement has purposes that are not all archived', () => {
    const agreement = createMockAgreement({
      state: 'ACTIVE',
    })
    const purpose = createMockPurpose({
      id: 'test-purpose-1',
      currentVersion: {
        state: 'ARCHIVED',
      },
    })
    const purpose2 = createMockPurpose({
      id: 'test-purpose-2',
      currentVersion: {
        state: 'ACTIVE',
      },
    })
    mockUseGetConsumersList([purpose, purpose2])
    const { result } = renderUseGetConsumerAgreementAlertPropsHook(agreement)
    expect(result.current).toBeUndefined()
  })
})
