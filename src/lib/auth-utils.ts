import { Party } from '../../types'

export function isAdmin(party: Party | null) {
  return party?.platformRole === 'admin'
}

export function isOperatorAPI(party: Party | null) {
  return party?.platformRole === 'api'
}

export function isOperatorSecurity(party: Party | null) {
  return party?.platformRole === 'security'
}
