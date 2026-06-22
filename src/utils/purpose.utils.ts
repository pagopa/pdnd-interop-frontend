import type { Purpose, RiskAnalysisReviewMode } from '@/api/api.generatedTypes'
import type { TFunction } from 'i18next'
import { match } from 'ts-pattern'

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

export function getDaysToExpiration(expirationDate: string | undefined) {
  const now = new Date()
  return expirationDate
    ? Math.floor((new Date(expirationDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : undefined
}

export function getFormattedExpirationDate(expirationDate?: string) {
  return expirationDate
    ? new Date(expirationDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })
    : undefined
}

export function checkIsRulesetExpired(expirationDate: string | undefined) {
  const now = new Date()
  return expirationDate ? new Date(expirationDate) < now : false
}

/**
 * Returns the localized label for the risk analysis review mode. An undefined mode means the risk
 * analysis was completed and approved autonomously, with no reviewer assigned. Both the purpose
 * summary and details surfaces share the `riskAnalysisAssignment` i18n block.
 */
export function getReviewModeLabel(
  reviewMode: RiskAnalysisReviewMode | undefined,
  t: TFunction<'purpose', 'riskAnalysisAssignment'>
) {
  return match(reviewMode)
    .with(undefined, () => t('mode.autonomy'))
    .with('ADMIN_WRITES_REVIEWER_SIGNS', () => t('mode.adminWritesReviewerSigns'))
    .with('REVIEWER_WRITES_REVIEWER_SIGNS', () => t('mode.reviewerWritesReviewerSigns'))
    .exhaustive()
}
