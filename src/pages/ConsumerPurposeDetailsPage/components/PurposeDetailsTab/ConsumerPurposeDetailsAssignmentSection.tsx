import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { getReviewModeLabel, getReviewerNames } from '@/utils/purpose.utils'

type ConsumerPurposeDetailsAssignmentSectionProps = {
  purpose: Purpose
}

export const ConsumerPurposeDetailsAssignmentSection: React.FC<
  ConsumerPurposeDetailsAssignmentSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisAssignment' })

  const modeLabel = getReviewModeLabel(purpose.reviewerWorkflow?.reviewMode, t)

  const reviewerNames = getReviewerNames(purpose.reviewerWorkflow?.reviewers)

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        <InformationContainer label={t('mode.label')} direction="row" content={modeLabel} />
        {reviewerNames.length > 0 && (
          <InformationContainer
            label={t('reviewer.label', { count: reviewerNames.length })}
            direction="row"
            content={reviewerNames.join(', ')}
          />
        )}
      </Stack>
    </SectionContainer>
  )
}
