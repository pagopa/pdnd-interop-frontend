import { Party } from '../../types'
import isEmpty from 'lodash/isEmpty'

export function isAdmin(party: Party | null) {
  return !isEmpty(party) && party!.platformRole === 'admin'
}

export function isOperatorAPI(party: Party | null) {
  return !isEmpty(party) && party!.platformRole === 'api'
}

export function isOperatorSecurity(party: Party | null) {
  return !isEmpty(party) && party!.platformRole === 'security'
}
