import React from 'react'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { STAGE } from '@/config/env'
import type { PagoPAEnvVars } from '@/types/common.types'

export const ProviderEServiceGeneralInfoSummary: React.FC = () => {
  const signalHubFlagDisabledStage: PagoPAEnvVars['STAGE'][] = ['PROD', 'UAT']
  const isSignalHubFlagDisabled = signalHubFlagDisabledStage.includes(STAGE) //check on the environment for signal hub flag
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.generalInfoSummary' })
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

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
      {!isSignalHubFlagDisabled && (
        <InformationContainer
          label={t('isSignalHubEnabled.label')}
          content={t(`isSignalHubEnabled.value.${descriptor.eservice.isSignalHubEnabled}`)}
        />
      )}
      <InformationContainer
        label={t('isDelegable.label')}
        content={t(`isDelegable.value.${descriptor.eservice.isDelegable}`)}
      />
      <InformationContainer
        label={t('isClientAccessDelegable.label')}
        content={t(`isClientAccessDelegable.value.${descriptor.eservice.isClientAccessDelegable}`)}
      />
    </Stack>
  )
}
