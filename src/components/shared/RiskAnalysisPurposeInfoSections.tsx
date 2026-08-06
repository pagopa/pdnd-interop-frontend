import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { Link } from '@/router'
import { Skeleton, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

type RiskAnalysisPurposeInfoSectionProps = {
  purpose: Purpose
}

/**
 * Read-only purpose sections shown to the reviewer, shared between the page that introduces the
 * risk analysis compilation and the detail page of an already signed/rejected risk analysis.
 * Both pages show the very same fields, so the copy keeps living under the
 * `riskAnalysisInfoCompile` prefix.
 */
export const RiskAnalysisPurposeGeneralInfoSection: React.FC<
  RiskAnalysisPurposeInfoSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisInfoCompile' })

  return (
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
        {purpose.isFreeOfCharge && (
          <InformationContainer
            label={t('generalInfoSection.freeOfChargeReason.label')}
            content={purpose.freeOfChargeReason || ''}
          />
        )}
      </Stack>
    </SectionContainer>
  )
}

export const RiskAnalysisPurposeLoadEstimateSection: React.FC<
  RiskAnalysisPurposeInfoSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisInfoCompile' })

  return (
    <SectionContainer title={t('loadEstimationSection.label')}>
      <Stack spacing={3}>
        <InformationContainer
          label={t('loadEstimationSection.dailyCalls.label')}
          content={`${purpose.currentVersion?.dailyCalls ?? purpose.waitingForApprovalVersion?.dailyCalls ?? 1}`}
        />
      </Stack>
    </SectionContainer>
  )
}

export const RiskAnalysisPurposeGeneralInfoSectionSkeleton: React.FC = () => (
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

export const RiskAnalysisPurposeLoadEstimateSectionSkeleton: React.FC = () => (
  <SectionContainer title="">
    <Stack spacing={3}>
      <Skeleton variant="text" width="30%" height={32} />
      <Skeleton variant="rectangular" height={56} />
    </Stack>
  </SectionContainer>
)
