import { PurposeQueries } from '@/api/purpose'
import { PurposeRiskAnalysisInfoSummary } from '@/components/shared/RiskAnalysisInfoSummary'
import { Alert, Stack } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { Purpose } from '@/api/api.generatedTypes'

type ConsumerPurposeSummaryRiskAnalysisAccordionProps = { purposeId: string } | { purpose: Purpose }

export const ConsumerPurposeSummaryRiskAnalysisAccordion: React.FC<
  ConsumerPurposeSummaryRiskAnalysisAccordionProps
> = (props) => {
  if ('purpose' in props) return <RiskAnalysisSummary purpose={props.purpose} />
  return <RiskAnalysisSummaryQuery purposeId={props.purposeId} />
}

const RiskAnalysisSummaryQuery: React.FC<{ purposeId: string }> = ({ purposeId }) => {
  const { data: purpose } = useSuspenseQuery(PurposeQueries.getSingle(purposeId))
  return <RiskAnalysisSummary purpose={purpose} />
}

const RiskAnalysisSummary: React.FC<{ purpose: Purpose }> = ({ purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'summary.riskAnalysisSection' })

  return (
    <>
      <Stack spacing={3}>
        <PurposeRiskAnalysisInfoSummary purpose={purpose} />
        {purpose.eservice.mode === 'RECEIVE' && (
          <Alert variant="outlined" severity="info">
            {t('providerRiskAnalysisAlert')}
          </Alert>
        )}
      </Stack>
    </>
  )
}
