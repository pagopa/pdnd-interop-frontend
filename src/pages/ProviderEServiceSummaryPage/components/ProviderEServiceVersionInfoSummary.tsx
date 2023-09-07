import React from 'react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { formatThousands, secondsToMinutes } from '@/utils/format.utils'

type ProviderEServiceVersionInfoSummaryProps = {
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceVersionInfoSummary: React.FC<
  ProviderEServiceVersionInfoSummaryProps
> = ({ descriptor }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.versionInfoSummary' })
  const { t: tCommon } = useTranslation('common')

  const voucherLifespan = secondsToMinutes(descriptor.voucherLifespan)
  const hasManualApproval = descriptor.agreementApprovalPolicy === 'MANUAL'

  return (
    <Stack spacing={2}>
      <InformationContainer
        label={t('description.label')}
        content={descriptor.description ?? 'n/a'}
      />
      <InformationContainer label={t('audience.label')} content={descriptor.audience[0]} />
      <InformationContainer
        label={t('voucherLifespan.label')}
        content={`${voucherLifespan} ${tCommon('time.minute', {
          count: voucherLifespan,
        })}`}
      />
      <InformationContainer
        label={t('dailyCallsPerConsumer.label')}
        content={t('dailyCallsPerConsumer.value', {
          value: formatThousands(descriptor.dailyCallsPerConsumer),
        })}
      />
      <InformationContainer
        label={t('dailyCallsTotal.label')}
        content={t('dailyCallsTotal.value', {
          value: formatThousands(descriptor.dailyCallsTotal),
        })}
      />
      <InformationContainer
        label={t('manualApproval.label')}
        content={t(`manualApproval.value.${hasManualApproval}`)}
      />
    </Stack>
  )
}
