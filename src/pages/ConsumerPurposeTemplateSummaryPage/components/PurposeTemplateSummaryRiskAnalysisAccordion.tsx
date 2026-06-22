import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { PurposeQueries } from '@/api/purpose/purpose.queries'
import { Stack } from '@mui/material'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import React from 'react'
import { PurposeTemplateRiskAnalysisInfoSummary } from '@/components/shared/PurposeTemplate/PurposeTemplateRiskAnalysisInfoSummary'

type PurposeTemplateSummaryRiskAnalysisAccordionProps = {
  purposeTemplateId: string
}

export const PurposeTemplateSummaryRiskAnalysisAccordion: React.FC<
  PurposeTemplateSummaryRiskAnalysisAccordionProps
> = ({ purposeTemplateId }) => {
  const { data: purposeTemplate } = useSuspenseQuery(
    PurposeTemplateQueries.getSingle(purposeTemplateId)
  )

  const { data: riskAnalysisConfig } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({
      tenantKind: purposeTemplate.targetTenantKind,
    })
  )

  if (!riskAnalysisConfig || !purposeTemplate.purposeRiskAnalysisForm) {
    return null
  }

  return (
    <>
      <Stack spacing={3}>
        <PurposeTemplateRiskAnalysisInfoSummary
          purposeTemplate={purposeTemplate}
          riskAnalysisConfig={riskAnalysisConfig}
          riskAnalysisForm={purposeTemplate.purposeRiskAnalysisForm}
        />
      </Stack>
    </>
  )
}
