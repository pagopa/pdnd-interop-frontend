import type {
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  VerifiedTenantAttribute,
} from '@/types/attribute.types'
import type { Party } from '@/types/party.types'
import { remapTenantAttributeToPartyAttribute } from '../attribute/attribute.api.utils'

export function remapUserResponseData(data: Party, verifierId?: string) {
  const certifiedAttributes = data.attributes.certified as unknown as CertifiedTenantAttribute[]
  const verifiedAttributes = data.attributes.verified as unknown as VerifiedTenantAttribute[]
  const declaredAttributes = data.attributes.declared as unknown as DeclaredTenantAttribute[]

  const attributes = {
    certified: certifiedAttributes.map((att) =>
      remapTenantAttributeToPartyAttribute(att, 'certified')
    ),
    verified: verifiedAttributes.map((att) =>
      remapTenantAttributeToPartyAttribute(att, 'verified', verifierId)
    ),
    declared: declaredAttributes.map((att) =>
      remapTenantAttributeToPartyAttribute(att, 'declared')
    ),
  }
  return { ...data, attributes }
}
