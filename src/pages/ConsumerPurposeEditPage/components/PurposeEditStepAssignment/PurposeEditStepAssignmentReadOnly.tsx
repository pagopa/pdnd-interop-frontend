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
import type { Purpose } from '@/api/api.generatedTypes'

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

  const reviewMode = purpose.reviewMode ?? 'ADMIN_WRITES_ADMIN_SIGNS'

  const subtitle = match(purpose.currentVersion?.state)
    .with('DRAFT', () => t('readOnly.subtitle.signed'))
    .with('ACTIVE', () => t('readOnly.subtitle.published'))
    .otherwise(() => t('readOnly.subtitle.notDraft'))

  const reviewers = purpose.reviewerWorkflow?.reviewers ?? []
  // An assigned reviewer may no longer be resolvable (role revoked on SelfCare, left the
  // organization, or a different tenant in a delegation): fall back to a placeholder
  // instead of rendering a blank value.
  const reviewerNames = reviewers
    .map((reviewer) => `${reviewer.name} ${reviewer.familyName}`.trim())
    .map((name) => name || t('readOnly.reviewerUnknown'))

  return (
    <>
      <SectionContainer title={t('title')} description={subtitle}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('readOnly.modeLabel')}
            direction="row"
            content={t(`reviewModeField.options.${reviewMode}`)}
          />
          {reviewerNames.length > 0 && (
            <InformationContainer
              label={t('readOnly.reviewerLabel', { count: reviewerNames.length })}
              direction="row"
              content={reviewerNames.join(', ')}
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
