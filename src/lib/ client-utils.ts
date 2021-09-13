import { Client } from '../../types'
import { CLIENT_COMPUTED_STATUS_LABEL } from './constants'

export function getClientComputedStatus(item: Client): keyof typeof CLIENT_COMPUTED_STATUS_LABEL {
  if (
    (item.serviceAgreementStatus === 'published' || item.serviceAgreementStatus === 'deprecated') &&
    item.agreementStatus === 'active' &&
    item.clientStatus === 'active'
  ) {
    return 'active'
  }

  return 'blocked'
}
