import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import React from 'react'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ConsumerPurposeDetailsDailyCallsThresholdsCard } from './ConsumerPurposeDetailsDailyCallsThresholdsCard'
import { ConsumerPurposeDetailsDailyCallsPlanCard } from './ConsumerPurposeDetailsDailyCallsPlanCard'
import { ConsumerPurposeDetailsDailyCallsUpdatePlanCard } from './ConsumerPurposeDetailsDailyCallsUpdatePlanCard'

type ConsumerPurposeDetailsLoadEstimateSectionProps = {
  purpose: Purpose
}

export const ConsumerPurposeDetailsLoadEstimateSection: React.FC<
  ConsumerPurposeDetailsLoadEstimateSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'consumerView.sections.loadEstimate',
  })

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <ConsumerPurposeDetailsDailyCallsPlanCard purpose={purpose} />
          <ConsumerPurposeDetailsDailyCallsUpdatePlanCard purpose={purpose} />
        </Stack>
        <ConsumerPurposeDetailsDailyCallsThresholdsCard
          dailyCallsPerConsumer={purpose.dailyCallsPerConsumer}
          dailyCallsTotal={purpose.dailyCallsTotal}
        />
      </Stack>
    </SectionContainer>
  )
}
