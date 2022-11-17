import { UserProductRole, UserRole, UserState } from '@/types/party.types'

export type PartyGetUsersListUrlParams = {
  tenantId?: string
  personId?: string
  roles?: Array<UserRole>
  states?: Array<UserState>
  productRoles?: Array<UserProductRole>
  query?: string
}
