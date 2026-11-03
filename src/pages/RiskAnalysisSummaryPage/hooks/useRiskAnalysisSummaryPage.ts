import { PurposeQueries } from '@/api/purpose'
import { useNavigate, useParams } from '@/router'
import { checkIsRulesetExpired } from '@/utils/purpose.utils'
import { useQuery } from '@tanstack/react-query'
import { useGetConsumerPurposeAlertProps } from '../../ConsumerPurposeSummaryPage/hooks/useGetConsumerPurposeAlertProps'
import { useDialog, useToastNotificationStore } from '@/stores'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import type { PurposeServices } from '@/api/purpose'
import { useRiskAnalysisReviewStore } from '../riskAnalysisReview.store'
import isEqual from 'lodash/isEqual'

type ReviewedPurpose = Awaited<ReturnType<typeof PurposeServices.getSingle>>

export function useRiskAnalysisSummaryPage() {
  const { purposeId } = useParams<'SUBSCRIBE_RISK_ANALYSIS_SUMMARY'>()
  const navigate = useNavigate()
  const { openDialog } = useDialog()
  const showToast = useToastNotificationStore((state) => state.showToast)
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.signRiskAnalysis.outcome',
  })

  const storedReview = useRiskAnalysisReviewStore((state) => state.pendingReview)
  const pendingReview = storedReview?.purposeId === purposeId ? storedReview : undefined
  const {
    data: purpose,
    isLoading,
    isFetching,
  } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    refetchInterval: pendingReview ? 1000 : false,
  })
  const isSavedFormAvailable =
    pendingReview &&
    pendingReview.previousMetadataVersion !== undefined &&
    purpose?.metadataVersion !== undefined &&
    purpose.metadataVersion > pendingReview.previousMetadataVersion &&
    purpose.riskAnalysisForm?.version === pendingReview.riskAnalysisForm.version &&
    isEqual(purpose.riskAnalysisForm?.answers, pendingReview.riskAnalysisForm.answers)
  const candidatePurpose = !pendingReview || isSavedFormAvailable ? purpose : undefined
  const [review, setReview] = useState<{
    purposeId: string
    purpose: ReviewedPurpose | undefined
    failed: boolean
    startedAt: number
  }>({ purposeId, purpose: candidatePurpose, failed: false, startedAt: Date.now() })
  const reviewForPurpose = review.purposeId === purposeId ? review : undefined
  // Keep the displayed content and its metadata version together throughout this review.
  // Live query updates still drive operational guards, but cannot approve unseen changes.
  const reviewedPurpose = reviewForPurpose?.failed
    ? undefined
    : (reviewForPurpose?.purpose ?? candidatePurpose)
  if (review.purposeId !== purposeId || (!review.purpose && reviewedPurpose)) {
    setReview({ purposeId, purpose: reviewedPurpose, failed: false, startedAt: Date.now() })
  }

  useEffect(() => {
    if (!storedReview) return
    if (storedReview.purposeId !== purposeId || reviewedPurpose) {
      useRiskAnalysisReviewStore.getState().setPendingReview(undefined)
      return
    }

    // A successful save may precede its readmodel update. Never pin the old cached form,
    // including a no-op save: its metadata must advance before a new review can begin.
    const timeout = window.setTimeout(
      () => {
        setReview({ purposeId, purpose: undefined, failed: true, startedAt: Date.now() })
        useRiskAnalysisReviewStore.getState().setPendingReview(undefined)
        showToast(t('error'), 'error')
        navigate('SUBSCRIBE_RISK_ANALYSIS_LIST', { replace: true })
      },
      Math.max(0, 20_000 - (Date.now() - review.startedAt))
    )
    return () => window.clearTimeout(timeout)
  }, [storedReview, purposeId, reviewedPurpose, review.startedAt, navigate, showToast, t])

  const isEserviceDeliverMode = purpose?.eservice.mode === 'DELIVER'

  const expirationDate = purpose?.rulesetExpiration
  const isRulesetExpired = checkIsRulesetExpired(expirationDate)

  const alertProps = useGetConsumerPurposeAlertProps(purpose)

  const eservicePersonalData = purpose?.eservice.personalData

  const riskAnswer = reviewedPurpose?.riskAnalysisForm?.answers?.usesPersonalData?.[0]

  const isRiskAnswerIncompatible =
    !!riskAnswer &&
    eservicePersonalData !== undefined &&
    ((riskAnswer === 'YES' && eservicePersonalData !== true) ||
      (riskAnswer === 'NO' && eservicePersonalData !== false))

  const isPublishButtonDisabled =
    (purpose?.riskAnalysisForm && isRiskAnswerIncompatible) ||
    (isEserviceDeliverMode && isRulesetExpired)

  const arePublishOrEditButtonsDisabled =
    !reviewedPurpose ||
    purpose?.agreement.state === 'ARCHIVED' ||
    purpose?.eservice.descriptor.state === 'ARCHIVED'

  const handleEditDraft = () => {
    navigate('SUBSCRIBE_RISK_ANALYSIS_COMPILE', {
      params: { purposeId },
    })
  }

  const handleApproveDraft = () => {
    if (!reviewedPurpose?.currentVersion) return

    const { metadataVersion } = reviewedPurpose
    if (metadataVersion === undefined) {
      showToast(t('error'), 'error')
      return
    }

    openDialog({
      type: 'approveRiskAnalysis',
      purposeId,
      metadataVersionToSign: metadataVersion,
    })
  }

  const handleRejectDraft = () => {
    if (!reviewedPurpose?.currentVersion) return
    openDialog({
      type: 'rejectRiskAnalysis',
      purposeId,
    })
  }

  return {
    purposeId,
    purpose,
    reviewedPurpose,
    isPurposeLoading: isLoading,
    isLoading: isLoading || (!!pendingReview && !reviewedPurpose),
    isFetching,
    isEserviceDeliverMode,
    expirationDate,
    isRulesetExpired,
    alertProps,
    isPublishButtonDisabled,
    arePublishOrEditButtonsDisabled,
    handleEditDraft,
    handleRejectDraft,
    handleApproveDraft,
  }
}
