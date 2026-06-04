import { PurposeQueries } from '@/api/purpose'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { Link, useNavigate, useParams } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Skeleton, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { InformationContainer } from '@pagopa/interop-fe-commons'

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
              <SectionContainer title={t('generalInfoSection.label')}>
                <Stack spacing={3}>
                  <InformationContainer
                    label={t('generalInfoSection.eService.label')}
                    content={
                      <Link
                        to="SUBSCRIBE_CATALOG_VIEW"
                        params={{
                          eserviceId: purpose.eservice.id,
                          descriptorId: purpose.eservice.descriptor.id,
                        }}
                        target="_blank"
                      >
                        {purpose.eservice.name}
                      </Link>
                    }
                  />
                  <InformationContainer
                    label={t('generalInfoSection.producer.label')}
                    content={purpose.eservice.producer.name}
                  />
                  <InformationContainer
                    label={t('generalInfoSection.purposeName.label')}
                    content={purpose.title}
                  />
                  <InformationContainer
                    label={t('generalInfoSection.purposeDescription.label')}
                    content={purpose.description}
                  />
                  <InformationContainer
                    label={t('generalInfoSection.isFreeOfCharge.label')}
                    content={
                      purpose.isFreeOfCharge
                        ? t('generalInfoSection.isFreeOfCharge.options.YES')
                        : t('generalInfoSection.isFreeOfCharge.options.NO')
                    }
                  />
                  <InformationContainer
                    label={t('generalInfoSection.freeOfChargeReason.label')}
                    content={purpose.freeOfChargeReason || ''}
                  />
                </Stack>
              </SectionContainer>
              <SectionContainer title={t('loadEstimationSection.label')}>
                <Stack spacing={3}>
                  <InformationContainer
                    label={t('loadEstimationSection.dailyCalls.label')}
                    content={`${purpose.currentVersion?.dailyCalls ?? purpose.waitingForApprovalVersion?.dailyCalls ?? 1}`}
                  />
                </Stack>
              </SectionContainer>
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

const RiskAnalysisGeneralInfoSectionSkeleton: React.FC = () => (
  <SectionContainer title="">
    <Stack spacing={3}>
      <Skeleton variant="text" width="40%" height={32} />
      <Skeleton variant="rectangular" height={56} />
      <Skeleton variant="rectangular" height={56} />
      <Skeleton variant="rectangular" height={56} />
      <Skeleton variant="rectangular" height={56} />
    </Stack>
  </SectionContainer>
)

const RiskAnalysisLoadEstimateSectionSkeleton: React.FC = () => (
  <SectionContainer title="">
    <Stack spacing={3}>
      <Skeleton variant="text" width="30%" height={32} />
      <Skeleton variant="rectangular" height={56} />
    </Stack>
  </SectionContainer>
)

const RiskAnalysisInfoCompilePageSkeleton: React.FC = () => {
  return (
    <Stack spacing={3}>
      <RiskAnalysisGeneralInfoSectionSkeleton />
      <RiskAnalysisLoadEstimateSectionSkeleton />
    </Stack>
  )
}

export default RiskAnalysisInfoCompilePage
