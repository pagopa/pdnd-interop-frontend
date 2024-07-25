import type { Agreement } from '@/api/api.generatedTypes'
import { renderHook } from '@testing-library/react'
import { useGetConsumerAgreementCreateAlertProps } from '../useGetConsumerAgreementCreateAlertProps'
import { createMockAgreement } from '../../../../../__mocks__/data/agreement.mocks'

function renderUseGetConsumerAgreementCreateAlertPropsHook(agreementMock?: Agreement) {
  return renderHook(() => useGetConsumerAgreementCreateAlertProps(agreementMock))
}

describe('check if useGetConsumerAgreementCreateAlertProps returns the correct alertProps based on the passed agreement - no agreement', () => {
  it('shoud not return any alertProps if no agreement is given', () => {
    const { result } = renderUseGetConsumerAgreementCreateAlertPropsHook()
    expect(result.current).toBeUndefined()
  })

  it('shoud not return any alertProps if not a draft agreement is given', () => {
    const agreement = createMockAgreement({
      state: 'ACTIVE',
    })
    const { result } = renderUseGetConsumerAgreementCreateAlertPropsHook(agreement)
    expect(result.current).toBeUndefined()
  })

  it('shoud return the correct alertProps if a draft agreement with new eservice version is given', () => {
    const agreement = createMockAgreement({
      state: 'DRAFT',
      eservice: {
        version: '1',
        activeDescriptor: {
          version: '2',
        },
      },
    })
    const { result } = renderUseGetConsumerAgreementCreateAlertPropsHook(agreement)
    expect(result.current?.severity).toBe('warning')
    expect(result.current?.content).toBe('edit.newVersionAlert')
    expect(result.current?.action).toBeUndefined()
  })

  it('shoud return the correct alertProps if a draft agreement with no contact mail is given', () => {
    const agreement = createMockAgreement({
      state: 'DRAFT',
      consumer: {
        contactMail: {
          address: undefined,
        },
      },
    })
    const { result } = renderUseGetConsumerAgreementCreateAlertPropsHook(agreement)
    expect(result.current?.severity).toBe('warning')
    expect(result.current?.content).toBe('edit.noContactEmailAlert')
    expect(result.current?.action).toBeDefined()
  })
})
