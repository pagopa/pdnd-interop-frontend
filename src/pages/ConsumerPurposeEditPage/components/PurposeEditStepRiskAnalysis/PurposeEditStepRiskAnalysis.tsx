import React from 'react'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { RiskAnalysisForm, RiskAnalysisFormSkeleton } from './RiskAnalysisForm/RiskAnalysisForm'
import { useNavigate, useParams } from '@/router'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { match } from 'ts-pattern'
import { useDialog } from '@/stores'

import { useQuery } from '@tanstack/react-query'

export const PurposeEditStepRiskAnalysis: React.FC<ActiveStepProps> = ({ back }) => {
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const navigate = useNavigate()
  const { openDialog } = useDialog()

  const { mutate: updatePurpose, isPending: isSaving } = PurposeMutations.useUpdateDraft()
  const { mutate: submitRiskAnalysis, isPending: isSubmittingForReviewer } =
    PurposeMutations.useSubmitRiskAnalysis()
  const { data: purpose } = useQuery(PurposeQueries.getSingle(purposeId))

  const { data: riskAnalysis } = useQuery({
    ...PurposeQueries.getRiskAnalyisLatestOrSpecificVersion({
      eserviceId: purpose?.eservice.id,
      riskAnalysisVersion: purpose?.riskAnalysisForm?.version,
      tenantKind: purpose?.consumer.kind,
    }),
  })

  if (!purpose || !riskAnalysis) {
    return <RiskAnalysisFormSkeleton />
  }

  const isReviewerApprovalMode = match(purpose.reviewerWorkflow?.reviewMode)
    .with('ADMIN_WRITES_REVIEWER_SIGNS', () => true)
    .with('REVIEWER_WRITES_REVIEWER_SIGNS', () => false)
    .with(undefined, () => false)
    .exhaustive()

  const goToSummary = () => {
    navigate('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: {
        purposeId: purposeId,
      },
    })
  }

  const saveDraft = (answers: Record<string, string[]>, options?: { onSuccess?: () => void }) => {
    updatePurpose(
      {
        purposeId: purpose.id,
        title: purpose.title,
        description: purpose.description,
        riskAnalysisForm: { version: riskAnalysis.version, answers },
        freeOfChargeReason: purpose.freeOfChargeReason,
        isFreeOfCharge: purpose.isFreeOfCharge,
        dailyCalls: purpose.currentVersion!.dailyCalls, // the current version is always present due to it being set in step 1
      },
      options
    )
  }

  const handleSaveAndGoToSummary = (answers: Record<string, string[]>) => {
    saveDraft(answers, { onSuccess: goToSummary })
  }

  const handleRequestApproval = (answers: Record<string, string[]>) => {
    openDialog({
      type: 'requestPurposeApproval',
      reviewerId: purpose.reviewerWorkflow?.reviewerIds?.[0] ?? '',
      // The chain (updateDraft -> submitRiskAnalysis -> navigate) runs in the
      // parent so the MutationObservers stay mounted across the dialog close.
      // Running the chain inside the dialog would break: closeDialog() unmounts
      // the dialog, and the second mutate() call (inside the first onSuccess)
      // would target a destroyed MutationObserver and silently no-op.
      onConfirm: () => {
        updatePurpose(
          {
            purposeId: purpose.id,
            title: purpose.title,
            description: purpose.description,
            riskAnalysisForm: { version: riskAnalysis.version, answers },
            freeOfChargeReason: purpose.freeOfChargeReason,
            isFreeOfCharge: purpose.isFreeOfCharge,
            dailyCalls: purpose.currentVersion!.dailyCalls,
          },
          {
            onSuccess: () => {
              submitRiskAnalysis(
                {
                  purposeId: purpose.id,
                  riskAnalysisForm: { version: riskAnalysis.version, answers },
                },
                { onSuccess: goToSummary }
              )
            },
          }
        )
      },
    })
  }

  return (
    <RiskAnalysisForm
      riskAnalysis={riskAnalysis}
      defaultAnswers={purpose.riskAnalysisForm?.answers}
      onSubmit={isReviewerApprovalMode ? handleRequestApproval : handleSaveAndGoToSummary}
      onCancel={back}
      personalData={purpose.eservice.personalData}
      isReviewerApprovalMode={isReviewerApprovalMode}
      onSaveDraft={isReviewerApprovalMode ? handleSaveAndGoToSummary : undefined}
      isSubmitting={isSaving || isSubmittingForReviewer}
    />
  )
}
