import React from 'react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'

type ProviderEServiceGeneralInfoSummaryProps = {
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceGeneralInfoSummary: React.FC<
  ProviderEServiceGeneralInfoSummaryProps
> = ({ descriptor }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.generalInfoSummary' })

  return (
    <Stack spacing={2}>
      <InformationContainer
        label={t('description.label')}
        content={descriptor.eservice.description}
      />
      <InformationContainer
        label={t('apiTechnology.label')}
        content={descriptor.eservice.technology}
      />
    </Stack>
  )
}
