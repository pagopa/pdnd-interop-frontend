import React from 'react'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { formatThousands, secondsToMinutes } from '@/utils/format.utils'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'

export const ProviderEServiceVersionInfoSummary: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.versionInfoSummary' })
  const { t: tCommon } = useTranslation('common')
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

  if (!descriptor) return null

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
