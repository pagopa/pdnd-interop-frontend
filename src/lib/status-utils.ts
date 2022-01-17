import { AgreementStatus, AgreementSummary, Client, ProviderOrSubscriber } from '../../types'
import { COMPUTED_STATUS_LABEL } from '../config/labels'

export function getClientComputedStatus(item: Client): keyof typeof COMPUTED_STATUS_LABEL {
  if (
    (item.agreement.descriptor.state === 'PUBLISHED' ||
      item.agreement.descriptor.state === 'DEPRECATED') &&
    item.agreement.state === 'active' &&
    item.state === 'active'
  ) {
    return 'active'
  }

  return 'inactive'
}

export function getAgreementStatus(
  item: AgreementSummary,
  mode: ProviderOrSubscriber | null
): AgreementStatus {
  if (item.state !== 'suspended') {
    return item.state
  }

  if (mode === 'provider') {
    return !!item.suspendedByProducer ? 'suspended' : 'active'
  }

  return !!item.suspendedBySubscriber ? 'suspended' : 'active'
}
