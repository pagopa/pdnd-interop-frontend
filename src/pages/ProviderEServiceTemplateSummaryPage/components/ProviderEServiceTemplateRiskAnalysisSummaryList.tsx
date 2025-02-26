import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { ProviderEServiceTemplateRiskAnalysisSummary } from './ProviderEServiceTemplateRiskAnalysisSummary'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { TemplateQueries } from '@/api/template'

export const ProviderEServiceTemplateRiskAnalysisSummaryList: React.FC = () => {
  const { t } = useTranslation('template', { keyPrefix: 'summary.riskAnalysisSummaryList' })
  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()

  const { data: template } = useSuspenseQuery(
    TemplateQueries.getSingle(params.eServiceTemplateId, params.eServiceTemplateVersionId)
  )

  const riskAnalysisList = template.eserviceTemplate.riskAnalysis

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
          <ProviderEServiceTemplateRiskAnalysisSummary riskAnalysisId={riskAnalysis.id} />
        </Stack>
      ))}
    </Stack>
  )
}
