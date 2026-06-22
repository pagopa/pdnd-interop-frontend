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

  // BE does not yet expose the reviewer's first/last name: we render the raw UUID as a placeholder.
  // We surface only the first reviewer: the BE models `reviewerIds` as a list to allow multiple
  // reviewers in the future, but today at most one reviewer is ever assigned.
  // BE invariant: when `reviewerWorkflow` is defined, `reviewerIds` is non-empty.
  const reviewerId = purpose.reviewerWorkflow?.reviewerIds[0]

  return (
    <Stack spacing={2}>
      <InformationContainer content={modeLabel} direction="row" label={t('mode.label')} />
      {reviewerId && (
        <InformationContainer content={reviewerId} direction="row" label={t('reviewer.label')} />
      )}
    </Stack>
  )
}
