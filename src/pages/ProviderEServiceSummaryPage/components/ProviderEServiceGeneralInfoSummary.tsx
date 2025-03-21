import React from 'react'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { FEATURE_FLAG_SIGNALHUB_WHITELIST, SIGNALHUB_WHITELIST_PRODUCER } from '@/config/env'
import { AuthHooks } from '@/api/auth'

export const ProviderEServiceGeneralInfoSummary: React.FC = () => {
  const producerId = AuthHooks.useJwt().jwt?.organizationId as string
  const isSignalHubFlagEnabled = FEATURE_FLAG_SIGNALHUB_WHITELIST
    ? SIGNALHUB_WHITELIST_PRODUCER.includes(producerId)
    : true

  const { isOrganizationAllowedToProduce } = AuthHooks.useJwt()

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
      {isSignalHubFlagEnabled && (
        <InformationContainer
          label={t('isSignalHubEnabled.label')}
          content={t(`isSignalHubEnabled.value.${descriptor.eservice.isSignalHubEnabled}`)}
        />
      )}
      {isOrganizationAllowedToProduce && (
        <>
          <InformationContainer
            label={t('isConsumerDelegable.label')}
            content={t(`isConsumerDelegable.value.${descriptor.eservice.isConsumerDelegable}`)}
          />
          <InformationContainer
            label={t('isClientAccessDelegable.label')}
            content={t(
              `isClientAccessDelegable.value.${descriptor.eservice.isClientAccessDelegable}`
            )}
          />
        </>
      )}
    </Stack>
  )
}
