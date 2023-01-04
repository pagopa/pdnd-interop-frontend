import {
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  VerifiedTenantAttribute,
} from '@/types/attribute.types'
import { EServiceDescriptorCatalog, EServiceDescriptorProvider } from '@/types/eservice.types'
import { PartyMail, UserType } from '@/types/party.types'
import { remapTenantAttributeToPartyAttribute } from '../attribute/attribute.api.utils'

export function updateDescriptorCatalogPartyMailCache(
  mail: PartyMail,
  descriptorCatalog?: EServiceDescriptorCatalog
) {
  if (!descriptorCatalog || !descriptorCatalog.eservice.isMine) return descriptorCatalog

  return { ...descriptorCatalog, eservice: { ...descriptorCatalog.eservice, mail } }
}

export function updateDescriptorProviderPartyMailCache(
  mail: PartyMail,
  descriptorProvider?: EServiceDescriptorProvider
) {
  if (!descriptorProvider) return descriptorProvider

  return { ...descriptorProvider, eservice: { ...descriptorProvider.eservice, mail } }
}

export function remapUserResponseData(data: UserType, verifierId?: string) {
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
