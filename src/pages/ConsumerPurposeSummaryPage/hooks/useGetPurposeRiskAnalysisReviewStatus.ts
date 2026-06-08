import type { Purpose, RiskAnalysisSigningState } from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

type RiskAnalysisReviewChip = {
  label: string
  color: 'warning' | 'success' | 'error'
}

type PurposeRiskAnalysisReviewStatus = {
  signingState: RiskAnalysisSigningState | undefined
  /** Inline status chip for the risk analysis accordion title (undefined for option 1). */
  chip: RiskAnalysisReviewChip | undefined
  /** Risk analysis is waiting for the reviewer to fill in or approve it. */
  isAwaitingReview: boolean
  /** Risk analysis has not been filled in yet by the assigned reviewer (empty accordion body). */
  isAwaitingCompilation: boolean
  /** Risk analysis has been rejected by the reviewer. */
  isRejected: boolean
  /** Publish CTA must be disabled because of the review state. */
  isPublishDisabledByReview: boolean
  /** Copy for the info alert shown above the bottom actions (undefined when not applicable). */
  infoAlertText: string | undefined
}

/**
 * Derives the risk analysis review status shown on the consumer purpose summary page
 * (status chip, info/error alerts and publish gating) from the purpose reviewer workflow.
 */
export function useGetPurposeRiskAnalysisReviewStatus(
  purpose: Purpose | undefined
): PurposeRiskAnalysisReviewStatus {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'summary.riskAnalysisSection.reviewStatus',
  })

  const signingState = purpose?.reviewerWorkflow?.signingState
  const reviewMode = purpose?.reviewerWorkflow?.reviewMode

  const chip = match(signingState)
    .returnType<RiskAnalysisReviewChip | undefined>()
    .with('DRAFT', () => ({ label: t('chip.approvalToRequest'), color: 'error' }))
    .with('ASSIGNED', () => ({ label: t('chip.awaitingCompilation'), color: 'warning' }))
    .with('SUBMITTED', () => ({ label: t('chip.awaitingApproval'), color: 'warning' }))
    .with('SIGNED', () => ({ label: t('chip.approved'), color: 'success' }))
    .with('REJECTED', () => ({ label: t('chip.rejected'), color: 'error' }))
    .with(undefined, () => undefined)
    .exhaustive()

  const isApprovalToRequest = signingState === 'DRAFT'
  const isAwaitingCompilation = signingState === 'ASSIGNED'
  const isAwaitingReview = isAwaitingCompilation || signingState === 'SUBMITTED'
  const isRejected = signingState === 'REJECTED'
  const isPublishDisabledByReview = isApprovalToRequest || isAwaitingReview || isRejected

  const infoAlertText = isAwaitingReview
    ? match(reviewMode)
        .with('ADMIN_WRITES_REVIEWER_SIGNS', () => t('infoAlert.adminWritesReviewerSigns'))
        .with('REVIEWER_WRITES_REVIEWER_SIGNS', () => t('infoAlert.reviewerWritesReviewerSigns'))
        .with(undefined, () => undefined)
        .exhaustive()
    : undefined

  return {
    signingState,
    chip,
    isAwaitingReview,
    isAwaitingCompilation,
    isRejected,
    isPublishDisabledByReview,
    infoAlertText,
  }
}
