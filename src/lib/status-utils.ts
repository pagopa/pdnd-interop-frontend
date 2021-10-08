import { AgreementStatus, AgreementSummary, Client, ProviderOrSubscriber } from '../../types'
import { COMPUTED_STATUS_LABEL } from './constants'

export function getClientComputedStatus(item: Client): keyof typeof COMPUTED_STATUS_LABEL {
  if (
    (item.agreement.descriptor.status === 'published' ||
      item.agreement.descriptor.status === 'deprecated') &&
    item.agreement.status === 'active' &&
    item.status === 'active'
  ) {
    return 'active'
  }

  return 'inactive'
}

export function getAgreementStatus(
  item: AgreementSummary,
  mode: ProviderOrSubscriber | null
): AgreementStatus {
  if (item.status !== 'suspended') {
    return item.status
  }

  if (mode === 'provider') {
    return !!item.suspendedByProducer ? 'suspended' : 'active'
  }

  return !!item.suspendedBySubscriber ? 'suspended' : 'active'
}
