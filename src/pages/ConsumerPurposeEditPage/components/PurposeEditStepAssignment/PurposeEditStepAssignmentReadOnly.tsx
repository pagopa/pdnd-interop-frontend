import React from 'react'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { SectionContainer } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import type { Purpose, RiskAnalysisReviewMode, User } from '@/api/api.generatedTypes'
import type { ReviewModeOption } from './PurposeEditStepAssignmentForm'

const reviewModeToOption = (reviewMode: RiskAnalysisReviewMode | undefined): ReviewModeOption =>
  match(reviewMode)
    .with('ADMIN_WRITES_REVIEWER_SIGNS', () => 'selfWritesReviewerSigns' as const)
    .with('REVIEWER_WRITES_REVIEWER_SIGNS', () => 'reviewerWritesReviewerSigns' as const)
    .with(undefined, () => 'selfWritesSelfSigns' as const)
    .exhaustive()

type PurposeEditStepAssignmentReadOnlyProps = ActiveStepProps & {
  purpose: Purpose
  reviewers: Array<User>
}

const PurposeEditStepAssignmentReadOnly: React.FC<PurposeEditStepAssignmentReadOnlyProps> = ({
  purpose,
  reviewers,
  forward,
  back,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit.stepAssignment' })
  const { t: tEdit } = useTranslation('purpose', { keyPrefix: 'edit' })

  const reviewerWorkflow = purpose.reviewerWorkflow
  const reviewModeOption = reviewModeToOption(reviewerWorkflow?.reviewMode)

  const reviewerId = reviewerWorkflow?.reviewerIds[0]
  const reviewer = reviewers.find((u) => u.userId === reviewerId)
  const reviewerName = reviewer ? `${reviewer.name} ${reviewer.familyName}`.trim() : ''

  return (
    <>
      <SectionContainer title={t('title')} description={t('description')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('readOnly.modeLabel')}
            direction="row"
            content={t(`reviewModeField.options.${reviewModeOption}`)}
          />
          {reviewerWorkflow && (
            <InformationContainer
              label={t('readOnly.reviewerLabel')}
              direction="row"
              content={reviewerName}
            />
          )}
        </Stack>
      </SectionContainer>
      <StepActions
        back={{
          label: tEdit('backWithoutSaveBtn'),
          type: 'button',
          onClick: back,
          startIcon: <ArrowBackIcon />,
        }}
        forward={{
          label: t('readOnly.forwardBtn'),
          type: 'button',
          onClick: forward,
          endIcon: <ArrowForwardIcon />,
        }}
      />
    </>
  )
}

export default PurposeEditStepAssignmentReadOnly
