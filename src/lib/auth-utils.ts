import { Party } from '../../types'

export function isAdmin(party: Party | null) {
  return party?.productInfo.role === 'admin'
}

export function isOperatorAPI(party: Party | null) {
  return party?.productInfo.role === 'api'
}

export function isOperatorSecurity(party: Party | null) {
  return party?.productInfo.role === 'security'
}
