import type { UserProductRole, UserRole, UserState } from '@/types/party.types'

export type PartyGetUsersListUrlParams = {
  tenantId?: string
  personId?: string
  roles?: Array<UserRole>
  states?: Array<UserState>
  productRoles?: Array<UserProductRole>
  query?: string
}

/**
 * This type must come from mui-italia.
 * Waiting for type PartySwitchItem to have property "productRole" as Array<UserProductRole> and not string | undefined
 */
export type PartyItem = {
  id: string
  description: string
  userProductRoles: Array<UserProductRole>
}
