import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { Stack } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'

type PurposeTemplateSummaryRiskAnalysisAccordionProps = {
  purposeTemplateId: string
}

export const PurposeTemplateSummaryRiskAnalysisAccordion: React.FC<
  PurposeTemplateSummaryRiskAnalysisAccordionProps
> = ({ purposeTemplateId }) => {
  const { data: purposeTemplate } = useSuspenseQuery(
    PurposeTemplateQueries.getSingle(purposeTemplateId)
  )
  const { t } = useTranslation('purpose', { keyPrefix: 'summary.riskAnalysisSection' })

  return (
    <>
      <Stack spacing={3}>
        {/* <PurposeTemplateRiskAnalysisInfoSummary purposeTemplate={purposeTemplate} /> */}
        TO DO: COMMENT OUT WHEN BRANCH IS MERGED
      </Stack>
    </>
  )
}
