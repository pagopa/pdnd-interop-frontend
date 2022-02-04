import { AgreementState, AgreementSummary, ProviderOrSubscriber } from '../../types'

export function getAgreementState(
  item: AgreementSummary,
  mode: ProviderOrSubscriber | null
): AgreementState {
  if (item.state !== 'SUSPENDED') {
    return item.state
  }

  if (mode === 'provider') {
    return !!item.suspendedByProducer ? 'SUSPENDED' : 'ACTIVE'
  }

  return !!item.suspendedBySubscriber ? 'SUSPENDED' : 'ACTIVE'
}
