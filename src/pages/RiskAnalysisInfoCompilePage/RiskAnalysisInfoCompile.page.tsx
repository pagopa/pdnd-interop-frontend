import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import { useNavigate, useParams } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  RiskAnalysisPurposeGeneralInfoSection,
  RiskAnalysisPurposeGeneralInfoSectionSkeleton,
  RiskAnalysisPurposeLoadEstimateSection,
  RiskAnalysisPurposeLoadEstimateSectionSkeleton,
} from '@/components/shared/RiskAnalysisPurposeInfoSections'

const RiskAnalysisInfoCompilePage: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisInfoCompile' })
  const { purposeId } = useParams<'SUBSCRIBE_RISK_ANALYSIS_INFO_COMPILE'>()
  const navigate = useNavigate()

  const { data: purpose, isLoading } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    throwOnError: true,
  })

  const handleBeginCompile = () => {
    if (purpose?.id) {
      navigate('SUBSCRIBE_RISK_ANALYSIS_COMPILE', {
        params: { purposeId: purpose.id },
      })
    }
  }

  return (
    <PageContainer
      title={t('title')}
      isLoading={isLoading}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_RISK_ANALYSIS_LIST',
      }}
    >
      <Grid container sx={{ mt: 3 }}>
        <Grid item xs={12}>
          {!purpose ? (
            <RiskAnalysisInfoCompilePageSkeleton />
          ) : (
            <Stack spacing={3}>
              <RiskAnalysisPurposeGeneralInfoSection purpose={purpose} />
              <RiskAnalysisPurposeLoadEstimateSection purpose={purpose} />
            </Stack>
          )}
        </Grid>
      </Grid>
      <Stack direction="row" sx={{ mt: 5, justifyContent: 'right' }}>
        <Button onClick={handleBeginCompile} variant="contained" type="button" disabled={isLoading}>
          {t('beginCompileBtn')}
        </Button>
      </Stack>
    </PageContainer>
  )
}

const RiskAnalysisInfoCompilePageSkeleton: React.FC = () => {
  return (
    <Stack spacing={3}>
      <RiskAnalysisPurposeGeneralInfoSectionSkeleton />
      <RiskAnalysisPurposeLoadEstimateSectionSkeleton />
    </Stack>
  )
}

export default RiskAnalysisInfoCompilePage
