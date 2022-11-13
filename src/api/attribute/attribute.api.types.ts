import {
  AttributeKind,
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  VerifiedAttributesRenewalType,
  VerifiedTenantAttribute,
} from '@/types/attribute.types'

export type GetSingleAttributeResponse = {
  id: string
  code: string
  kind: AttributeKind
  description: string
  origin: string
  name: string
  creationTime: string
}

export type GetListAttributesResponse = { attributes: Array<GetSingleAttributeResponse> }

export type GetCertifiedAttributesResponse = {
  attributes: Array<CertifiedTenantAttribute>
}

export type GetVerifiedAttributesResponse = {
  attributes: Array<VerifiedTenantAttribute>
}

export type GetDeclaredAttributesResponse = {
  attributes: Array<DeclaredTenantAttribute>
}

export type CreateAttributePayload = {
  code: string
  kind: AttributeKind
  description: string
  origin: string
  name: string
}

export type VerifyPartyAttributeAttributePayload = {
  id: string
  renewal: VerifiedAttributesRenewalType
  expirationDate?: string
}
