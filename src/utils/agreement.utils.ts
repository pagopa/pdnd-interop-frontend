import { AgreementSummary } from '@/types/agreement.types'
import { ProviderOrConsumer } from '@/types/common.types'

export const canAgreementBeUpgraded = (agreement: AgreementSummary, mode: ProviderOrConsumer) => {
  if (!agreement || mode !== 'consumer') return false

  return !!(
    agreement.eservice.activeDescriptor &&
    agreement.eservice.activeDescriptor.state === 'PUBLISHED' &&
    agreement.eservice.activeDescriptor.version > agreement.eservice.version &&
    agreement.state !== 'ARCHIVED'
  )
}
