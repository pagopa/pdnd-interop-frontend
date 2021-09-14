import { Client } from '../../types'
import { CLIENT_COMPUTED_STATUS_LABEL } from './constants'

export function getClientComputedStatus(item: Client): keyof typeof CLIENT_COMPUTED_STATUS_LABEL {
  if (
    (item.agreement.descriptor.status === 'published' ||
      item.agreement.descriptor.status === 'deprecated') &&
    item.agreement.status === 'active' &&
    item.status === 'active'
  ) {
    return 'active'
  }

  return 'blocked'
}
