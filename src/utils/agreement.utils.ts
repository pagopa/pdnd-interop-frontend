import type { AgreementSummary } from '@/types/agreement.types'
import type { ProviderOrConsumer } from '@/types/common.types'

export const canAgreementBeUpgraded = (agreement: AgreementSummary, mode: ProviderOrConsumer) => {
  if (mode !== 'consumer') return false

  return !!(
    agreement.eservice.activeDescriptor &&
    ['PUBLISHED', 'SUSPENDED'].includes(agreement.eservice.activeDescriptor.state) &&
    agreement.eservice.activeDescriptor.version > agreement.eservice.version &&
    agreement.state !== 'ARCHIVED'
  )
}
