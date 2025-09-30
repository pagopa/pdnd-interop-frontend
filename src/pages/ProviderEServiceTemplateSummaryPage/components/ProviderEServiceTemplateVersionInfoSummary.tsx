import React from 'react'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { formatThousands, secondsToMinutes } from '@/utils/format.utils'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'

export const ProviderEServiceTemplateVersionInfoSummary: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'summary.versionInfoSummary' })
  const { t: tCommon } = useTranslation('common')
  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()

  const { data: eserviceTemplate } = useSuspenseQuery(
    EServiceTemplateQueries.getSingle(params.eServiceTemplateId, params.eServiceTemplateVersionId)
  )

  const voucherLifespan = secondsToMinutes(eserviceTemplate.voucherLifespan)
  const hasManualApproval = eserviceTemplate.agreementApprovalPolicy === 'MANUAL'

  return (
    <Stack spacing={2}>
      <InformationContainer
        label={t('description.label')}
        content={eserviceTemplate.eserviceTemplate.description ?? 'n/a'}
      />
      <InformationContainer
        label={t('audience.label')}
        content={eserviceTemplate.eserviceTemplate.intendedTarget}
      />
      <InformationContainer
        label={t('voucherLifespan.label')}
        content={`${voucherLifespan} ${tCommon('time.minute', {
          count: voucherLifespan,
        })}`}
      />
      <InformationContainer
        label={t('dailyCallsPerConsumer.label')}
        content={t('dailyCallsPerConsumer.value', {
          value: eserviceTemplate.dailyCallsPerConsumer
            ? formatThousands(eserviceTemplate.dailyCallsPerConsumer)
            : 'n/a',
        })}
      />
      <InformationContainer
        label={t('dailyCallsTotal.label')}
        content={t('dailyCallsTotal.value', {
          value: eserviceTemplate.dailyCallsTotal
            ? formatThousands(eserviceTemplate.dailyCallsTotal)
            : 'n/a',
        })}
      />
      <InformationContainer
        label={t('manualApproval.label')}
        content={t(`manualApproval.value.${hasManualApproval}`)}
      />
    </Stack>
  )
}
