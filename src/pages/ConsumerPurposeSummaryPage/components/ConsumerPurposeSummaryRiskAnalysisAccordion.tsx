import { PurposeQueries } from '@/api/purpose'
import { PurposeRiskAnalysisInfoSummary } from '@/components/shared/RiskAnalysisInfoSummary'
import { Alert, Stack } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ConsumerPurposeSummaryRiskAnalysisAccordionProps = {
  purposeId: string
}

export const ConsumerPurposeSummaryRiskAnalysisAccordion: React.FC<
  ConsumerPurposeSummaryRiskAnalysisAccordionProps
> = ({ purposeId }) => {
  const { data: purpose } = useSuspenseQuery(PurposeQueries.getSingle(purposeId))
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
