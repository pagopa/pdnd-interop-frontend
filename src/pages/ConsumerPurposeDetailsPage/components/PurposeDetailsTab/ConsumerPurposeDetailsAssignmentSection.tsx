import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { getReviewModeLabel } from '@/utils/purpose.utils'

type ConsumerPurposeDetailsAssignmentSectionProps = {
  purpose: Purpose
}

export const ConsumerPurposeDetailsAssignmentSection: React.FC<
  ConsumerPurposeDetailsAssignmentSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisAssignment' })

  const modeLabel = getReviewModeLabel(purpose.reviewerWorkflow?.reviewMode, t)

  // We surface only the first reviewer: the BE models `reviewers` as a list to allow multiple
  // reviewers in the future, but today at most one reviewer is ever assigned.
  const reviewer = purpose.reviewerWorkflow?.reviewers?.[0]
  const reviewerName = reviewer ? `${reviewer.name} ${reviewer.familyName}`.trim() : undefined

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        <InformationContainer label={t('mode.label')} direction="row" content={modeLabel} />
        {reviewerName && (
          <InformationContainer
            label={t('reviewer.label')}
            direction="row"
            content={reviewerName}
          />
        )}
      </Stack>
    </SectionContainer>
  )
}
