import type { ExternalId } from '@/api/api.generatedTypes'

export type UserProductRole = 'admin' | 'security' | 'api' | 'support'

export type DelegationType = 'DELEGATION_GRANTED' | 'DELEGATION_RECEIVED'

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
  externalId?: ExternalId
  organization: JwtOrg
  selfcareId: string
  uid: string // the relationshipId between the user and the current institution
  name: string
  family_name: string
  organizationId: string
  rootParent?: { id: string; description: string }
}
