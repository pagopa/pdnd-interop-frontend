import {
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  PartyAttribute,
  VerifiedTenantAttribute,
} from './../../types/attribute.types'
import { AttributeKey } from '@/types/attribute.types'
import {
  GetCertifiedAttributesResponse,
  GetDeclaredAttributesResponse,
  GetVerifiedAttributesResponse,
} from './attribute.api.types'

export function remapTenantAttributeToPartyAttribute(
  tenantAttribute: CertifiedTenantAttribute | VerifiedTenantAttribute | DeclaredTenantAttribute,
  attributeKey: AttributeKey,
  verifierId?: string
) {
  const attributeValue: Partial<PartyAttribute> = {
    id: tenantAttribute.id,
    name: tenantAttribute.name,
  }

  if (attributeKey !== 'verified') {
    attributeValue.state = tenantAttribute.revocationTimestamp ? 'REVOKED' : 'ACTIVE'
  } else {
    const verifiedTenantAttribute =
      tenantAttribute as GetVerifiedAttributesResponse['attributes'][0]

    // If a verifierId is passed, put only the attributes verified by him with 'ACTIVE' state
    if (verifierId) {
      const acceptedByProvider = verifiedTenantAttribute.verifiedBy.some((a) => a.id === verifierId)
      attributeValue.state = acceptedByProvider ? 'ACTIVE' : 'REVOKED'
    }

    // if no verifierId is passed, put as 'ACTIVE' every attributes that has at least one entry in 'verifiedBy'
    if (!verifierId) {
      attributeValue.state = verifiedTenantAttribute.verifiedBy.length > 0 ? 'ACTIVE' : 'REVOKED'
    }
  }

  return attributeValue as PartyAttribute
}

export function remapAttributeResponseData(
  response:
    | GetCertifiedAttributesResponse
    | GetVerifiedAttributesResponse
    | GetDeclaredAttributesResponse,
  attributeKey: AttributeKey,
  verifierId?: string
) {
  return response.attributes.map((tenantAttribute) =>
    remapTenantAttributeToPartyAttribute(tenantAttribute, attributeKey, verifierId)
  )
}
