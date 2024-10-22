import React from 'react'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { STAGE } from '@/config/env'

export const ProviderEServiceGeneralInfoSummary: React.FC = () => {
  const disabledStage = ['PROD', 'UAT']
  const isDisabled = disabledStage.includes(STAGE) //check on the environment
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.generalInfoSummary' })
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

  if (!descriptor) return null

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
      {!isDisabled && (
        <InformationContainer
          label={t('isSignalHubEnabled.label')}
          content={t(`isSignalHubEnabled.value.${descriptor.eservice.isSignalHubEnabled}`)}
        />
      )}
    </Stack>
  )
}
