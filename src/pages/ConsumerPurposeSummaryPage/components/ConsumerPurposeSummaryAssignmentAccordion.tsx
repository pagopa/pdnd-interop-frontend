import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PurposeQueries } from '@/api/purpose'
import { getReviewModeLabel, getReviewerNames } from '@/utils/purpose.utils'

type ConsumerPurposeSummaryAssignmentAccordionProps = {
  purposeId: string
}

export const ConsumerPurposeSummaryAssignmentAccordion: React.FC<
  ConsumerPurposeSummaryAssignmentAccordionProps
> = ({ purposeId }) => {
  const { data: purpose } = useSuspenseQuery(PurposeQueries.getSingle(purposeId))
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisAssignment' })

  const modeLabel = getReviewModeLabel(purpose.reviewerWorkflow?.reviewMode, t)

  const reviewerNames = getReviewerNames(purpose.reviewerWorkflow?.reviewers)

  return (
    <Stack spacing={2}>
      <InformationContainer content={modeLabel} direction="row" label={t('mode.label')} />
      {reviewerNames.length > 0 && (
        <InformationContainer
          content={reviewerNames.join(', ')}
          direction="row"
          label={t('reviewer.label', { count: reviewerNames.length })}
        />
      )}
    </Stack>
  )
}
