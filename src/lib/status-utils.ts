import { AgreementSummary, Client } from '../../types'
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

export function getAgreementComputedStatus(
  item: AgreementSummary
): keyof typeof COMPUTED_STATUS_LABEL {
  if (item.status === 'active') {
    return 'active'
  }

  return 'inactive'
}
