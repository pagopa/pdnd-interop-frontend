import { EServiceDescriptorCatalog, EServiceDescriptorProvider } from '@/types/eservice.types'
import { PartyMail } from '@/types/party.types'

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
