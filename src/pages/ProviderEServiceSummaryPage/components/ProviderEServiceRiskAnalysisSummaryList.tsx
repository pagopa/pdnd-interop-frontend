import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { ProviderEServiceRiskAnalysisSummary } from './ProviderEServiceRiskAnalysisSummary'
import { URL_FRAGMENTS } from '@/router/router.utils'

export const ProviderEServiceRiskAnalysisSummaryList: React.FC = () => {
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(
    params.eserviceId,
    params.descriptorId,
    {
      suspense: false,
      enabled: params.descriptorId !== URL_FRAGMENTS.FIRST_DRAFT,
    }
  )

  const { data: eservice } = EServiceQueries.useGetSingle(params.eserviceId, {
    suspense: false,
    enabled: params.descriptorId === URL_FRAGMENTS.FIRST_DRAFT,
  })

  if (!descriptor && !eservice) return null

  const riskAnalysisList = (descriptor?.eservice.riskAnalysis ?? eservice?.riskAnalysis)!

  return (
    <Stack spacing={3} divider={<Divider flexItem />}>
      {riskAnalysisList.map((riskAnalysis, i) => (
        <Stack key={riskAnalysis.id} spacing={3}>
          <Typography variant="h6" fontWeight={700}>{`TODO ${i + 1}/${riskAnalysisList.length} - ${
            riskAnalysis.name
          }`}</Typography>
          <ProviderEServiceRiskAnalysisSummary riskAnalysisId={riskAnalysis.id} />
        </Stack>
      ))}
    </Stack>
  )
}
