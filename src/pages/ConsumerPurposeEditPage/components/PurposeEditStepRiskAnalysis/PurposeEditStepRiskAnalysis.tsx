import React from 'react'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { RiskAnalysisForm, RiskAnalysisFormSkeleton } from './RiskAnalysisForm/RiskAnalysisForm'
import { useNavigate, useParams } from '@/router'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { SectionContainer } from '@/components/layout/containers'
import { StatusChip } from '@/components/shared/StatusChip'
import { StepActions } from '@/components/shared/StepActions'
import { RiskAnalysisInfoSummary } from '@/components/shared/RiskAnalysisInfoSummary'

import { useQuery } from '@tanstack/react-query'

export const PurposeEditStepRiskAnalysis: React.FC<ActiveStepProps> = ({ back }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const navigate = useNavigate()

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

  const reviewMode = purpose.reviewerWorkflow?.reviewMode
  const signingState = purpose.reviewerWorkflow?.signingState

  // Option 2: admin compiles, reviewer signs. Option 3: reviewer compiles and signs.
  const isOption2 = reviewMode === 'ADMIN_WRITES_REVIEWER_SIGNS'
  const isOption3 = reviewMode === 'REVIEWER_WRITES_REVIEWER_SIGNS'

  // Option 2 keeps the admin able to compile and request approval; option 1 has no reviewer.
  const isReviewerApprovalMode = isOption2

  // Read-only once the analysis has left the admin's hands and cannot be edited.
  const isReadOnly =
    (isOption2 && (signingState === 'SUBMITTED' || signingState === 'SIGNED')) ||
    (isOption3 && signingState === 'SIGNED')

  // Option 3 before the reviewer compiled: the whole step is hidden but the info card.
  const isAwaitingReviewerCompilation = isOption3 && signingState !== 'SIGNED'

  // Option 2 rejection: the form stays editable so the admin can fix and resubmit.
  const isRejected = isOption2 && signingState === 'REJECTED'

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
    // "Richiedi approvazione" persists the latest answers and then submits
    // the risk analysis to the reviewer; only after both succeed the user
    // lands on the purpose summary.
    saveDraft(answers, {
      onSuccess: () => {
        submitRiskAnalysis(
          {
            purposeId: purpose.id,
            riskAnalysisForm: { version: riskAnalysis.version, answers },
          },
          { onSuccess: goToSummary }
        )
      },
    })
  }

  // Locked states share one informational layout: title + status chip + subtitle +
  // personal-data flag, with the step CTAs.
  //  - read-only (opt2 submitted/approved, opt3 approved): also shows the compiled
  //    answers as a plain-text summary — only the given answers, no editable controls.
  //  - awaiting compilation (opt3, reviewer hasn't compiled yet): the form is hidden,
  //    only the card is shown.
  if (isReadOnly || isAwaitingReviewerCompilation) {
    const chipState = isReadOnly ? (signingState as 'SUBMITTED' | 'SIGNED') : 'ASSIGNED'
    const subtitleState = isReadOnly ? signingState : 'ASSIGNED'
    return (
      <>
        <SectionContainer
          title={t('stepRiskAnalysis.title')}
          titleEndAdornment={<StatusChip for="riskAnalysis" state={chipState} size="small" />}
          description={t(`stepRiskAnalysis.readOnlySubtitle.${subtitleState}`)}
          sx={{ mb: 2 }}
        >
          <InformationContainer
            label={t('stepRiskAnalysis.personalDataFlag.label')}
            content={t(
              `stepRiskAnalysis.personalDataFlag.content.${purpose.eservice.personalData}`
            )}
          />
        </SectionContainer>
        {isReadOnly && purpose.riskAnalysisForm && (
          <RiskAnalysisInfoSummary
            riskAnalysisConfig={riskAnalysis}
            riskAnalysisForm={purpose.riskAnalysisForm}
            innerSection={false}
            hideTitle
          />
        )}
        <StepActions
          back={{
            label: t('backWithoutSaveBtn'),
            type: 'button',
            onClick: back,
            startIcon: <ArrowBackIcon />,
          }}
          forward={{
            label: t('endWithSaveBtn'),
            type: 'button',
            onClick: goToSummary,
            endIcon: <ArrowForwardIcon />,
          }}
        />
      </>
    )
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
      isRejected={isRejected}
    />
  )
}
