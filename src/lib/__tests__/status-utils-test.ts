import { ProviderOrSubscriber } from '../../../types'
import {
  agreementActiveEservicePublished,
  agreementSuspendedByProducerEservicePublished,
  agreementSuspendedBySubscriberEservicePublished,
} from '../../__mocks__/agreement'
import {
  clientActiveAgreementActiveEserviceDeprecated,
  clientActiveAgreementActiveEservicePublished,
  clientActiveAgreementActiveEserviceSuspended,
  clientActiveAgreementSuspendedEservicePublished,
  clientSuspendedAgreementActiveEservicePublished,
} from '../../__mocks__/client'
import { getAgreementState, getClientComputedState } from '../status-utils'

describe('Client state', () => {
  it('is active', () => {
    const computedState = getClientComputedState(clientActiveAgreementActiveEservicePublished)
    expect(computedState).toBe('ACTIVE')
  })

  it('is active – even if e-service version is deprecated', () => {
    const computedState = getClientComputedState(clientActiveAgreementActiveEserviceDeprecated)
    expect(computedState).toBe('ACTIVE')
  })

  it('is inactive – client suspended', () => {
    const computedState = getClientComputedState(clientSuspendedAgreementActiveEservicePublished)
    expect(computedState).toBe('INACTIVE')
  })

  it('is inactive – agreement suspended', () => {
    const computedState = getClientComputedState(clientActiveAgreementSuspendedEservicePublished)
    expect(computedState).toBe('INACTIVE')
  })

  it('is inactive – e-service version suspended', () => {
    const computedState = getClientComputedState(clientActiveAgreementActiveEserviceSuspended)
    expect(computedState).toBe('INACTIVE')
  })
})

describe('Agreement state', () => {
  it('is active', () => {
    const mode = null
    const status = getAgreementState(agreementActiveEservicePublished, mode)
    expect(status).toBe('ACTIVE')
  })

  it('is suspended by producer', () => {
    const mode: ProviderOrSubscriber = 'provider'
    const status = getAgreementState(agreementSuspendedByProducerEservicePublished, mode)
    expect(status).toBe('SUSPENDED')
  })

  it('is suspended by subscriber', () => {
    const mode: ProviderOrSubscriber = 'subscriber'
    const status = getAgreementState(agreementSuspendedBySubscriberEservicePublished, mode)
    expect(status).toBe('SUSPENDED')
  })
})
