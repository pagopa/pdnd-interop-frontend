import { ProviderOrSubscriber } from '../../../types'
import {
  agreementActiveEservicePublished,
  agreementSuspendedByProducerEservicePublished,
  agreementSuspendedBySubscriberEservicePublished,
} from '../../__mocks__/agreement'
import { getAgreementState } from '../status-utils'

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
