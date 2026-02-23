import React from 'react'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'
import { SummaryInformationContainer } from '@/components/shared/SummaryInformationContainer'

export const ProviderEServiceGeneralInfoSummarySection: React.FC = () => {
  const { isOrganizationAllowedToProduce } = AuthHooks.useJwt()

  const { t } = useTranslation('eservice', { keyPrefix: 'summary.generalInfoSummary' })
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

  return (
    <Stack spacing={2}>
      <SummaryInformationContainer
        label={t('description.label')}
        content={descriptor.eservice.description}
      />
      <SummaryInformationContainer
        label={t('apiTechnology.label')}
        content={descriptor.eservice.technology}
      />
      {FEATURE_FLAG_ESERVICE_PERSONAL_DATA && (
        <SummaryInformationContainer
          label={t(`personalDataField.${descriptor.eservice.mode}.label`)}
          content={t(`personalDataField.value.${descriptor.eservice.personalData}`)}
        />
      )}
      {isOrganizationAllowedToProduce && (
        <>
          <SummaryInformationContainer
            label={t('isConsumerDelegable.label')}
            content={t(`isConsumerDelegable.value.${descriptor.eservice.isConsumerDelegable}`)}
          />
          <SummaryInformationContainer
            label={t('isClientAccessDelegable.label')}
            content={t(
              `isClientAccessDelegable.value.${descriptor.eservice.isClientAccessDelegable}`
            )}
          />
        </>
      )}
      <SummaryInformationContainer
        label={t('isSignalHubEnabled.label')}
        content={t(`isSignalHubEnabled.value.${descriptor.eservice.isSignalHubEnabled}`)}
      />
    </Stack>
  )
}
