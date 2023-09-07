import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import React from 'react'
import { ProviderPurposeDetailsDailyCallsThresholdsCard } from './ProviderPurposeDetailsDailyCallsThresholdsCard'
import { ProviderPurposeDetailsDailyCallsPlanCard } from './ProviderPurposeDetailsDailyCallsPlanCard'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

type ProviderPurposeDetailsLoadEstimateSectionProps = {
  purpose: Purpose
}

export const ProviderPurposeDetailsLoadEstimateSection: React.FC<
  ProviderPurposeDetailsLoadEstimateSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'providerView.sections.loadEstimate',
  })

  return (
    <SectionContainer newDesign title={t('title')} description={t('description')}>
      <Stack spacing={3}>
        <ProviderPurposeDetailsDailyCallsPlanCard purpose={purpose} />
        <ProviderPurposeDetailsDailyCallsThresholdsCard
          dailyCallsPerConsumer={purpose.dailyCallsPerConsumer}
          dailyCallsTotal={purpose.dailyCallsTotal}
        />
      </Stack>
    </SectionContainer>
  )
}
