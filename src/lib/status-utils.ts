import { AgreementState, AgreementSummary, Client, ProviderOrSubscriber } from '../../types'
import { COMPUTED_STATE_LABEL } from '../config/labels'

export function getClientComputedState(item: Client): keyof typeof COMPUTED_STATE_LABEL {
  if (
    (item.agreement.descriptor.state === 'PUBLISHED' ||
      item.agreement.descriptor.state === 'DEPRECATED') &&
    item.agreement.state === 'ACTIVE' &&
    item.state === 'active'
  ) {
    return 'active'
  }

  return 'inactive'
}

export function getAgreementState(
  item: AgreementSummary,
  mode: ProviderOrSubscriber | null
): AgreementState {
  if (item.state !== 'SUSPENDED') {
    return item.state
  }

  if (mode === 'provider') {
    return !!item.suspendedByProducer ? 'SUSPENDED' : 'ACTIVE'
  }

  return !!item.suspendedBySubscriber ? 'SUSPENDED' : 'ACTIVE'
}
