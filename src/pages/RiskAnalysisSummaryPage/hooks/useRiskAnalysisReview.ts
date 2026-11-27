import { PurposeQueries } from '@/api/purpose'
import type { PurposeServices } from '@/api/purpose'
import { useNavigate } from '@/router'
import { useToastNotificationStore } from '@/stores'
import { useQuery } from '@tanstack/react-query'
import isEqual from 'lodash/isEqual'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationType, useLocation, useNavigationType } from 'react-router-dom'
import { z } from 'zod'

type ReviewedPurpose = Awaited<ReturnType<typeof PurposeServices.getSingle>>

const savedReviewStateSchema = z.object({
  riskAnalysisSave: z.object({
    previousMetadataVersion: z.number().int().nonnegative().optional(),
    riskAnalysisForm: z.object({
      version: z.string(),
      answers: z.record(z.string(), z.array(z.string())),
    }),
  }),
})

type SavedReview = z.infer<typeof savedReviewStateSchema>['riskAnalysisSave']

function matchesSavedDraft(purpose: ReviewedPurpose, save: SavedReview) {
  return (
    save.previousMetadataVersion !== undefined &&
    purpose.metadataVersion !== undefined &&
    purpose.metadataVersion > save.previousMetadataVersion &&
    purpose.riskAnalysisForm?.version === save.riskAnalysisForm.version &&
    isEqual(purpose.riskAnalysisForm.answers, save.riskAnalysisForm.answers)
  )
}

export function useRiskAnalysisReview(purposeId: string, reviewerId?: string) {
  const locationState: unknown = useLocation().state
  const navigationType = useNavigationType()
  const navigate = useNavigate()
  const showToast = useToastNotificationStore((state) => state.showToast)
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateRiskAnalysis.outcome',
  })

  // Reloading or returning through history starts a new review of the current version.
  const [save] = useState(() =>
    navigationType === NavigationType.Pop
      ? undefined
      : savedReviewStateSchema.safeParse(locationState).data?.riskAnalysisSave
  )
  const [review, setReview] = useState<ReviewedPurpose | 'timedOut'>()
  const isWaitingForSave = save !== undefined && review === undefined
  const {
    data: purpose,
    isLoading,
    isFetching,
    isFetchedAfterMount,
    isSuccess,
  } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    refetchOnMount: 'always',
    refetchInterval: isWaitingForSave ? 1000 : false,
  })

  useEffect(() => {
    // Pin the displayed content and metadata version together after the first eligible fetch.
    if (review !== undefined || !purpose || !isSuccess || !isFetchedAfterMount || isFetching) return

    if (!save || matchesSavedDraft(purpose, save)) {
      setReview(purpose)
    }
  }, [review, purpose, isSuccess, isFetchedAfterMount, isFetching, save])

  useEffect(() => {
    if (!isWaitingForSave) return

    const timeout = window.setTimeout(() => setReview('timedOut'), 20_000)
    return () => window.clearTimeout(timeout)
  }, [isWaitingForSave])

  const isSignedForAssignedReviewer =
    purpose?.reviewerWorkflow?.signingState === 'SIGNED' &&
    (purpose.reviewerWorkflow.reviewers?.some((reviewer) => reviewer.userId === reviewerId) ??
      false)
  const shouldRedirectToDetails = isSignedForAssignedReviewer && !isLoading && !isFetching
  const reviewTimedOut = !isSignedForAssignedReviewer && review === 'timedOut'
  const reviewUnavailableMessage = t('reviewUnavailable')
  useEffect(() => {
    if (shouldRedirectToDetails) {
      navigate('SUBSCRIBE_RISK_ANALYSIS_DETAILS', { params: { purposeId }, replace: true })
    } else if (reviewTimedOut) {
      showToast(reviewUnavailableMessage, 'error')
      navigate('SUBSCRIBE_RISK_ANALYSIS_LIST', { replace: true })
    }
  }, [
    shouldRedirectToDetails,
    reviewTimedOut,
    navigate,
    purposeId,
    showToast,
    reviewUnavailableMessage,
  ])

  const reviewedPurpose = review === 'timedOut' ? undefined : review
  return {
    purpose,
    reviewedPurpose,
    isSignedForAssignedReviewer,
    isLoading: isLoading || isWaitingForSave || (!reviewedPurpose && isFetching),
  }
}
