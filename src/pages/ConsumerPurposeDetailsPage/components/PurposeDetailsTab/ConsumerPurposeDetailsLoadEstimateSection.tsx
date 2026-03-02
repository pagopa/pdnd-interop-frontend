import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import React from 'react'
import { Alert, Link, Stack } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import { ConsumerPurposeDetailsDailyCallsThresholdsCard } from './ConsumerPurposeDetailsDailyCallsThresholdsCard'
import { ConsumerPurposeDetailsDailyCallsPlanCard } from './ConsumerPurposeDetailsDailyCallsPlanCard'
import { ConsumerPurposeDetailsDailyCallsUpdatePlanCard } from './ConsumerPurposeDetailsDailyCallsUpdatePlanCard'

type ConsumerPurposeDetailsLoadEstimateSectionProps = {
  purpose: Purpose
  openRejectReasonDrawer: VoidFunction
}

export const ConsumerPurposeDetailsLoadEstimateSection: React.FC<
  ConsumerPurposeDetailsLoadEstimateSectionProps
> = ({ purpose, openRejectReasonDrawer }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'consumerView.sections.loadEstimate',
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
