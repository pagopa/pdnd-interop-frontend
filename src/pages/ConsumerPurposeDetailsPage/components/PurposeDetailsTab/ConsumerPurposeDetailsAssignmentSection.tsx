import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

type ConsumerPurposeDetailsAssignmentSectionProps = {
  purpose: Purpose
}

export const ConsumerPurposeDetailsAssignmentSection: React.FC<
  ConsumerPurposeDetailsAssignmentSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'consumerView.sections.riskAnalysisAssignment',
  })

  const reviewMode = purpose.reviewerWorkflow?.reviewMode

  const modeLabel = match(reviewMode)
    .with(undefined, () => t('mode.autonomy'))
    .with('ADMIN_WRITES_REVIEWER_SIGNS', () => t('mode.adminWritesReviewerSigns'))
    .with('REVIEWER_WRITES_REVIEWER_SIGNS', () => t('mode.reviewerWritesReviewerSigns'))
    .exhaustive()

  // We surface only the first reviewer: the BE models `reviewerIds` as a list to allow multiple
  // reviewers in the future, but today at most one reviewer is ever assigned.
  // TODO: the BE does not expose the reviewer's name yet, only `reviewerId`. We render the raw id
  // as a placeholder. Replace it with the reviewer's name/surname once the BE exposes them.
  const reviewerId = purpose.reviewerWorkflow?.reviewerIds[0]

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        <InformationContainer label={t('mode.label')} direction="row" content={modeLabel} />
        {reviewerId && (
          <InformationContainer label={t('reviewer.label')} direction="row" content={reviewerId} />
        )}
      </Stack>
    </SectionContainer>
  )
}
