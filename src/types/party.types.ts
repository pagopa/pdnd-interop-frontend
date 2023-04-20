import type { Tenant } from '@/api/api.generatedTypes'
import type { PartyAttribute } from './attribute.types'

export type UserProductRole = 'admin' | 'security' | 'api'

type JwtOrg = {
  name: string
  roles: Array<{
    role: UserProductRole
  }>
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

export type RemappedTenant = Omit<Tenant, 'attributes'> & {
  attributes: {
    certified: PartyAttribute[]
    verified: PartyAttribute[]
    declared: PartyAttribute[]
  }
}
