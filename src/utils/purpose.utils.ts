import type { Purpose } from '@/api/api.generatedTypes'

export function getPurposeFailureReasons(
  purpose: Purpose
): Array<'eservice' | 'agreement' | 'purpose'> {
  const isEserviceActive =
    purpose.eservice.descriptor.state === 'PUBLISHED' ||
    purpose.eservice.descriptor.state === 'DEPRECATED'
  const isAgreementActive = purpose.agreement.state === 'ACTIVE'
  const isPurposeActive = purpose.currentVersion && purpose.currentVersion.state === 'ACTIVE'

  const possibleReasons = [
    { labelKey: 'eservice', outcome: isEserviceActive },
    { labelKey: 'agreement', outcome: isAgreementActive },
    { labelKey: 'purpose', outcome: isPurposeActive },
  ]

  const reasons = possibleReasons
    .map(({ outcome, labelKey }) => (!outcome ? labelKey : undefined))
    .filter((r) => r) as Array<'eservice' | 'agreement' | 'purpose'>

  return reasons
}

/**
 * The purpose is suspended by the consumer when the `suspendedByConsumer` is `true` or
 * when the actual active party is both the e-service producer and the purpose consumer and
 * the `suspendedByProducer` is true.
 */
export function checkPurposeSuspendedByConsumer(purpose: Purpose, partyId?: string) {
  if (purpose?.currentVersion?.state !== 'SUSPENDED') return false
  if (purpose.suspendedByConsumer) return true

  const isPurposeSuspendedByProvider = purpose.suspendedByProducer
  const isActualPartyEServiceProvider = partyId === purpose.eservice.producer.id
  const isActualPartyPurposeConsumer = partyId === purpose.consumer.id

  return (
    isPurposeSuspendedByProvider && isActualPartyPurposeConsumer && isActualPartyEServiceProvider
  )
}
