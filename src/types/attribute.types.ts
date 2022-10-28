export type BackendAttributeContent = {
  id: string
  name: string
  creationTime: string
  origin: string
  code: string
  description: string
  explicitAttributeVerification: boolean
  verified?: boolean
  verificationDate?: string
}

export type AttributeKey = 'certified' | 'verified' | 'declared'

export type SingleBackendAttribute = {
  single: BackendAttributeContent
}
export type GroupBackendAttribute = {
  group: Array<BackendAttributeContent>
}

export type BackendAttribute = SingleBackendAttribute | GroupBackendAttribute
export type BackendAttributes = Record<AttributeKey, Array<BackendAttribute>>
export type AttributeKind = 'CERTIFIED' | 'VERIFIED' | 'DECLARED'

export type CatalogAttribute = {
  kind: AttributeKind
  creationTime: string
  description: string
  id: string
  name: string
  code?: string
  origin?: 'IPA'
}

export type FrontendAttribute = {
  attributes: Array<CatalogAttribute>
  explicitAttributeVerification: boolean
}

export type FrontendAttributes = Record<AttributeKey, Array<FrontendAttribute>>

export type VerifiedAttributesRenewalType = 'REVOKE_ON_EXPIRATION' | 'AUTOMATIC_RENEWAL'

export type PartyAttributes = Record<AttributeKey, Array<PartyAttribute>>

export type PartyAttribute = {
  id: string
  name: string
  state: 'ACTIVE' | 'REVOKED'
}

export type CertifiedTenantAttribute = {
  id: string
  name: string
  assignmentTimestamp: string
  revocationTimestamp?: string
}

export type VerifiedTenantAttribute = {
  id: string
  name: string
  assignmentTimestamp: string
  revocationTimestamp?: string
  renewal: VerifiedAttributesRenewalType
  verifiedBy: Array<{
    id: string
    verificationDate: string
    expirationDate?: string
    extentionDate?: string
  }>
  revokedBy: Array<{
    id: string
    verificationDate: string
    expirationDate?: string
    extentionDate?: string
    revocationDate: string
  }>
}

export type DeclaredTenantAttribute = {
  id: string
  name: string
  assignmentTimestamp: string
  revocationTimestamp?: string
}
