import type { RemappedTenant } from '@/types/party.types'
import type {
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  Tenant,
  VerifiedTenantAttribute,
} from '../api.generatedTypes'
import { remapTenantAttributeToPartyAttribute } from '../attribute/attribute.api.utils'

export function remapUserResponseData(data: Tenant, verifierId?: string): RemappedTenant {
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
