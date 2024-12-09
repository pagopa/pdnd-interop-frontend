import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { ProviderEServiceRiskAnalysisSummary } from './ProviderEServiceRiskAnalysisSummary'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'

export const ProviderEServiceRiskAnalysisSummaryList: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.riskAnalysisSummaryList' })
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

  const riskAnalysisList = descriptor.eservice.riskAnalysis

  return (
    <Stack spacing={3} divider={<Divider flexItem />}>
      {riskAnalysisList.map((riskAnalysis, index) => (
        <Stack key={riskAnalysis.id} spacing={3}>
          <Typography variant="h6" fontWeight={700}>
            {t('riskAnalysisTitle', {
              riskAnalysisIndex: index + 1,
              totalRiskAnalysis: riskAnalysisList.length,
              riskAnalysisName: riskAnalysis.name,
            })}
          </Typography>
          <ProviderEServiceRiskAnalysisSummary riskAnalysisId={riskAnalysis.id} />
        </Stack>
      ))}
    </Stack>
  )
}
