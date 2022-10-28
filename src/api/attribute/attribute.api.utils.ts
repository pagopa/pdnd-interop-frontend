import { PartyAttribute } from './../../types/attribute.types'
import { AttributeKey } from '@/types/attribute.types'
import {
  GetCertifiedAttributesResponse,
  GetDeclaredAttributesResponse,
  GetVerifiedAttributesResponse,
} from './attribute.api.types'

export function remapAttributeResponseData(
  response:
    | GetCertifiedAttributesResponse
    | GetVerifiedAttributesResponse
    | GetDeclaredAttributesResponse,
  attributeKey: AttributeKey,
  providerId: string
) {
  return response.attributes.map((tenantAttribute) => {
    const attributeValue: Partial<PartyAttribute> = {
      id: tenantAttribute.id,
      name: tenantAttribute.name,
    }

    if (attributeKey !== 'verified') {
      attributeValue.state = tenantAttribute.revocationTimestamp ? 'REVOKED' : 'ACTIVE'
    } else {
      const verifiedTenantAttribute =
        tenantAttribute as GetVerifiedAttributesResponse['attributes'][0]
      const acceptedByProvider = verifiedTenantAttribute.verifiedBy.find((a) => a.id === providerId)
      attributeValue.state = acceptedByProvider ? 'ACTIVE' : 'REVOKED'
    }

    return attributeValue as PartyAttribute
  })
}
