import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PurposeQueries } from '@/api/purpose'
import { getReviewModeLabel } from '@/utils/purpose.utils'

type ConsumerPurposeSummaryAssignmentAccordionProps = {
  purposeId: string
}

export const ConsumerPurposeSummaryAssignmentAccordion: React.FC<
  ConsumerPurposeSummaryAssignmentAccordionProps
> = ({ purposeId }) => {
  const { data: purpose } = useSuspenseQuery(PurposeQueries.getSingle(purposeId))
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisAssignment' })

  const modeLabel = getReviewModeLabel(purpose.reviewerWorkflow?.reviewMode, t)

  // We surface only the first reviewer: the BE models `reviewers` as a list to allow multiple
  // reviewers in the future, but today at most one reviewer is ever assigned.
  const reviewer = purpose.reviewerWorkflow?.reviewers?.[0]
  const reviewerName = reviewer ? `${reviewer.name} ${reviewer.familyName}`.trim() : undefined

  return (
    <Stack spacing={2}>
      <InformationContainer content={modeLabel} direction="row" label={t('mode.label')} />
      {reviewerName && (
        <InformationContainer content={reviewerName} direction="row" label={t('reviewer.label')} />
      )}
    </Stack>
  )
}
