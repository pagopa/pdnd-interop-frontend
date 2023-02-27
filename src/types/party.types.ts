import type { PartyAttributes } from './attribute.types'

export type UserState = 'PENDING' | 'ACTIVE' | 'SUSPENDED'
export type UserRole = 'MANAGER' | 'DELEGATE' | 'OPERATOR'
export type UserProductRole = 'admin' | 'security' | 'api'

type UserContract = {
  version: string
  path: string
}

export type PartyMail = {
  address: string
  description?: string
}

export type Party = {
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
  contactMail?: PartyMail
}

export type UserOnCreate = {
  name: string
  surname: string
  taxCode: string
  email: string
  role: UserRole
  product: UserProduct
  productRole: UserProductRole
  contract: UserContract
}

export type UserProduct = {
  createdAt: string // actually should be Date
  id: 'interop'
  role: UserProductRole
}

type JwtOrgRole = {
  partyRole: UserRole
  role: UserProductRole
}

type JwtOrg = {
  name: string
  roles: Array<JwtOrgRole>
  fiscal_code: string
}

export type JwtUser = {
  aud: string
  exp: number
  iat: number
  iss: string
  jti: string
  nbf: number
  organization: JwtOrg
  selfcareId: string
  uid: string // the relationshipId between the user and the current institution
  name: string
  family_name: string
  organizationId: string
}

export type SelfCareUser = {
  createdAt: string
  familyName: string
  from: string
  id: string
  name: string
  product: {
    createdAt: string // Date
    id: string
    role: UserProductRole
  }
  role: UserRole
  state: UserState
  taxCode: string
  to: string
  updatedAt: string // Date

  relationshipId: string // Existing when there is a relationship between a user and an Interop client
}
