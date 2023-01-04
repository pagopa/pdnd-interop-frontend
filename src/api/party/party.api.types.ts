import { UserProductRole, UserRole, UserState } from '@/types/party.types'
import { PartyAttributes } from '@/types/attribute.types'

export type UserType = {
  id: string
  selfcareId?: string
  externalId: {
    origin: string
    value: string
  }
  createdAt: string
  updatedAt: string
  name: string
  attributes: PartyAttributes
  contactMail?: string
}

export type PartyGetUsersListUrlParams = {
  tenantId?: string
  personId?: string
  roles?: Array<UserRole>
  states?: Array<UserState>
  productRoles?: Array<UserProductRole>
  query?: string
}
