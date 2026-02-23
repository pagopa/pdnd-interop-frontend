import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Stack } from '@mui/system'
import { ReadOnlyDescriptorAttributes } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { InformationContainer } from '@pagopa/interop-fe-commons'

export const ProviderEServiceAttributeVersionSummarySection: React.FC = () => {
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.attributeVersionSummary' })

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

  if (!descriptor) return null

  return (
    <>
      <Stack spacing={3} mb={3}>
        <Typography fontWeight={600}>{t('thresholds.label')}</Typography>
        <InformationContainer
          label={t('thresholds.dailyCallsPerConsumer.label')}
          content={t('thresholds.dailyCallsPerConsumer.value', {
            value: descriptor.dailyCallsPerConsumer,
          })}
        />
        <InformationContainer
          label={t('thresholds.dailyCallsTotal.label')}
          content={t('thresholds.dailyCallsTotal.value', { value: descriptor.dailyCallsTotal })}
        />
      </Stack>
      <ReadOnlyDescriptorAttributes descriptorAttributes={descriptor.attributes} />
    </>
  )
}
