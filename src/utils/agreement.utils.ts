import type { Agreement } from '@/api/api.generatedTypes'
import type { ProviderOrConsumer } from '@/types/common.types'

export const canAgreementBeUpgraded = (agreement: Agreement, mode: ProviderOrConsumer) => {
  if (mode !== 'consumer') return false

  return !!(
    agreement.eservice.activeDescriptor &&
    ['PUBLISHED', 'SUSPENDED'].includes(agreement.eservice.activeDescriptor.state) &&
    agreement.eservice.activeDescriptor.version > agreement.eservice.version &&
    ['ACTIVE', 'SUSPENDED'].includes(agreement.state)
  )
}
