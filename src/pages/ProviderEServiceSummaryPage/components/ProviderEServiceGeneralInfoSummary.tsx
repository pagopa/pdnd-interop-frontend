import React from 'react'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'
import { ProviderEServiceInformationContainer } from './ProviderEServiceInformationContainer'

export const ProviderEServiceGeneralInfoSummary: React.FC = () => {
  const { isOrganizationAllowedToProduce } = AuthHooks.useJwt()

  const { t } = useTranslation('eservice', { keyPrefix: 'summary.generalInfoSummary' })
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

  return (
    <Stack spacing={2}>
      <ProviderEServiceInformationContainer
        label={t('description.label')}
        content={descriptor.eservice.description}
      />
      <ProviderEServiceInformationContainer
        label={t('apiTechnology.label')}
        content={descriptor.eservice.technology}
      />
      {FEATURE_FLAG_ESERVICE_PERSONAL_DATA && (
        <ProviderEServiceInformationContainer
          label={t(`personalDataField.${descriptor.eservice.mode}.label`)}
          content={t(`personalDataField.value.${descriptor.eservice.personalData}`)}
        />
      )}
      {isOrganizationAllowedToProduce && (
        <>
          <ProviderEServiceInformationContainer
            label={t('isConsumerDelegable.label')}
            content={t(`isConsumerDelegable.value.${descriptor.eservice.isConsumerDelegable}`)}
          />
          <ProviderEServiceInformationContainer
            label={t('isClientAccessDelegable.label')}
            content={t(
              `isClientAccessDelegable.value.${descriptor.eservice.isClientAccessDelegable}`
            )}
          />
        </>
      )}
      <ProviderEServiceInformationContainer
        label={t('isSignalHubEnabled.label')}
        content={t(`isSignalHubEnabled.value.${descriptor.eservice.isSignalHubEnabled}`)}
      />
    </Stack>
  )
}
