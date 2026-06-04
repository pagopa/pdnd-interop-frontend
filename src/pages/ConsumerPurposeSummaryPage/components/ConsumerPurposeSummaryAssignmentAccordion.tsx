import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { PurposeQueries } from '@/api/purpose'

type ConsumerPurposeSummaryAssignmentAccordionProps = {
  purposeId: string
}

export const ConsumerPurposeSummaryAssignmentAccordion: React.FC<
  ConsumerPurposeSummaryAssignmentAccordionProps
> = ({ purposeId }) => {
  const { data: purpose } = useSuspenseQuery(PurposeQueries.getSingle(purposeId))
  const { t } = useTranslation('purpose', { keyPrefix: 'summary.assignmentSection' })

  const reviewMode = purpose.reviewerWorkflow?.reviewMode

  const modeLabel = match(reviewMode)
    .with(undefined, () => t('mode.autonomy'))
    .with('ADMIN_WRITES_REVIEWER_SIGNS', () => t('mode.adminWritesReviewerSigns'))
    .with('REVIEWER_WRITES_REVIEWER_SIGNS', () => t('mode.reviewerWritesReviewerSigns'))
    .exhaustive()

  // BE non espone ancora nome+cognome del Valutatore: mostriamo l'UUID raw come placeholder.
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
