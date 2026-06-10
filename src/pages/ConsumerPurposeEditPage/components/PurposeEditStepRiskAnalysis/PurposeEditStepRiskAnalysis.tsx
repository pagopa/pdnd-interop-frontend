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
import { match, P } from 'ts-pattern'

import { useQuery } from '@tanstack/react-query'

// Display mode of the risk analysis step, derived from the reviewer workflow.
//  - editable: option 1 (no reviewer) — plain editable form, as today.
//  - editable-approval: option 2 still in the admin's hands (draft/assigned/rejected) —
//    editable form with the "request approval" CTA; `isRejected` also shows the error alert.
//  - read-only: the analysis has left the admin's hands (opt2 submitted/signed, opt3 signed) —
//    shows the compiled answers as a summary, no editable controls.
//  - awaiting-compilation: option 3 before the reviewer signed — only the info card is shown.
type RiskAnalysisStepMode =
  | { kind: 'editable' }
  | { kind: 'editable-approval'; isRejected: boolean }
  | { kind: 'read-only'; lockedState: 'SUBMITTED' | 'SIGNED' }
  | { kind: 'awaiting-compilation' }

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

  const stepMode = match<
    { reviewMode: typeof reviewMode; signingState: typeof signingState },
    RiskAnalysisStepMode
  >({ reviewMode, signingState })
    // Option 1: no reviewer workflow → behaves as today.
    .with({ reviewMode: undefined }, () => ({ kind: 'editable' }))
    // Option 2: admin compiles, reviewer signs.
    .with(
      { reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS', signingState: P.union('SUBMITTED', 'SIGNED') },
      ({ signingState }) => ({ kind: 'read-only', lockedState: signingState })
    )
    .with({ reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS', signingState: 'REJECTED' }, () => ({
      kind: 'editable-approval',
      isRejected: true,
    }))
    // Option 2 still editable (draft/assigned): admin can compile and request approval.
    .with({ reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS' }, () => ({
      kind: 'editable-approval',
      isRejected: false,
    }))
    // Option 3: reviewer compiles AND signs in one step, so only ASSIGNED (awaiting
    // compilation) and SIGNED (approved) are reachable. DRAFT/undefined collapse into
    // the same awaiting state; SUBMITTED/REJECTED cannot occur in this mode and are
    // surfaced as an invariant violation instead of silently rendering the wrong chip.
    .with(
      {
        reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
        signingState: P.union('DRAFT', 'ASSIGNED', undefined),
      },
      () => ({ kind: 'awaiting-compilation' })
    )
    .with({ reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS', signingState: 'SIGNED' }, () => ({
      kind: 'read-only',
      lockedState: 'SIGNED',
    }))
    .with(
      {
        reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
        signingState: P.union('SUBMITTED', 'REJECTED'),
      },
      ({ signingState }) => {
        throw new Error(
          `Unreachable risk analysis signing state "${signingState}" for REVIEWER_WRITES_REVIEWER_SIGNS`
        )
      }
    )
    .exhaustive()

  // Option 2 keeps the admin able to compile and request approval; option 1 has no reviewer.
  const isReviewerApprovalMode = stepMode.kind === 'editable-approval'

  // Option 2 rejection: the form stays editable so the admin can fix and resubmit.
  const isRejected = stepMode.kind === 'editable-approval' && stepMode.isRejected

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
  if (stepMode.kind === 'read-only' || stepMode.kind === 'awaiting-compilation') {
    // Both the status chip and the subtitle copy key from the same locked state.
    const lockedState = stepMode.kind === 'read-only' ? stepMode.lockedState : 'ASSIGNED'
    return (
      <>
        <SectionContainer
          title={t('stepRiskAnalysis.title')}
          titleEndAdornment={<StatusChip for="riskAnalysis" state={lockedState} size="small" />}
          description={t(`stepRiskAnalysis.readOnlySubtitle.${lockedState}`)}
          sx={{ mb: 2 }}
        >
          <InformationContainer
            label={t('stepRiskAnalysis.personalDataFlag.label')}
            content={t(
              `stepRiskAnalysis.personalDataFlag.content.${purpose.eservice.personalData}`
            )}
          />
        </SectionContainer>
        {stepMode.kind === 'read-only' && purpose.riskAnalysisForm && (
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
      rejectionReason={purpose.reviewerWorkflow?.rejectionReason}
    />
  )
}
