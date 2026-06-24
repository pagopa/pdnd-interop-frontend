import React from 'react'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { SectionContainer } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import type { Purpose } from '@/api/api.generatedTypes'
import { beEnumToReviewModeOption } from './PurposeEditStepAssignmentForm'

type PurposeEditStepAssignmentReadOnlyProps = ActiveStepProps & {
  purpose: Purpose
}

const PurposeEditStepAssignmentReadOnly: React.FC<PurposeEditStepAssignmentReadOnlyProps> = ({
  purpose,
  forward,
  back,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit.stepAssignment' })
  const { t: tEdit } = useTranslation('purpose', { keyPrefix: 'edit' })

  const reviewerWorkflow = purpose.reviewerWorkflow
  const reviewModeOption = beEnumToReviewModeOption(reviewerWorkflow?.reviewMode)

  const reviewer = reviewerWorkflow?.reviewers?.[0]
  // The assigned reviewer may no longer be resolvable (role revoked on SelfCare, left the
  // organization, or a different tenant in a delegation): fall back to a placeholder
  // instead of rendering a blank value.
  const reviewerName = reviewer
    ? `${reviewer.name} ${reviewer.familyName}`.trim()
    : t('readOnly.reviewerUnknown')

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
