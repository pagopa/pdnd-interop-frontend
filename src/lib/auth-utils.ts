import { Party } from '../../types'
import isEmpty from 'lodash/isEmpty'

export function isAdmin(party: Party | null) {
  return !isEmpty(party) && (party!.role === 'Manager' || party!.role === 'Delegate')
  // return !isEmpty(user) && user!.platformRole === 'admin'
}
