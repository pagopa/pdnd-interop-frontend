import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { ProviderEServiceRiskAnalysisSummary } from './ProviderEServiceRiskAnalysisSummary'

export const ProviderEServiceRiskAnalysisSummaryList: React.FC = () => {
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(
    params.eserviceId,
    params.descriptorId
  )

  if (!descriptor) return null

  const purposeList = descriptor?.eservice.riskAnalysis

  return (
    <Stack spacing={3}>
      {purposeList.map((purpose, i) => (
        <Stack key={purpose.id} spacing={3}>
          <Typography
            variant="h6"
            fontWeight={700}
          >{`TODO ${i}/${purposeList.length} - ${purpose.name}`}</Typography>
          <ProviderEServiceRiskAnalysisSummary
            riskAnalysisTemplate={purpose.riskAnalysisForm.answers}
          />
          {i !== purposeList.length - 1 && <Divider />}
        </Stack>
      ))}
    </Stack>
  )
}
