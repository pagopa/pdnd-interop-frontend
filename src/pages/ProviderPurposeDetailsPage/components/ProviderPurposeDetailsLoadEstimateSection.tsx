import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import React from 'react'
import { ProviderPurposeDetailsDailyCallsThresholdsCard } from './ProviderPurposeDetailsDailyCallsThresholdsCard'
import { ProviderPurposeDetailsDailyCallsPlanCard } from './ProviderPurposeDetailsDailyCallsPlanCard'
import { Alert, Link, Stack } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'

type ProviderPurposeDetailsLoadEstimateSectionProps = {
  purpose: Purpose
  openRejectReasonDrawer: VoidFunction
}

export const ProviderPurposeDetailsLoadEstimateSection: React.FC<
  ProviderPurposeDetailsLoadEstimateSectionProps
> = ({ purpose, openRejectReasonDrawer }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'providerView.sections.loadEstimate',
  })

  const isUpdatePlanRejected = Boolean(purpose.currentVersion) && Boolean(purpose.rejectedVersion)

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={3}>
        {isUpdatePlanRejected && (
          <Alert severity="error" variant="outlined">
            <Trans
              components={{
                1: (
                  <Link
                    onClick={openRejectReasonDrawer}
                    variant="body2"
                    fontWeight={700}
                    sx={{ cursor: 'pointer' }}
                  />
                ),
              }}
            >
              {t('rejectedUpdatePlanAlert')}
            </Trans>
          </Alert>
        )}
        <ProviderPurposeDetailsDailyCallsPlanCard purpose={purpose} />
        <ProviderPurposeDetailsDailyCallsThresholdsCard
          dailyCallsPerConsumer={purpose.dailyCallsPerConsumer}
          dailyCallsTotal={purpose.dailyCallsTotal}
        />
      </Stack>
    </SectionContainer>
  )
}

export const ProviderPurposeDetailsLoadEstimateSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={620} />
}
