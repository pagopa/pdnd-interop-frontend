import React from 'react'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import { SummaryInformationContainer } from '@/components/shared/SummaryInformationContainer'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'

export const ProviderEServiceGeneralInfoSummarySection: React.FC = () => {
  const { isOrganizationAllowedToProduce } = AuthHooks.useJwt()

  const { t } = useTranslation('eservice', { keyPrefix: 'summary.generalInfoSummary' })
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

  const isEserviceFromTemplate = Boolean(descriptor?.templateRef)
  const eserviceTemplateId = descriptor?.templateRef?.templateId
  const { data: eserviceTemplate } = useQuery({
    ...EServiceTemplateQueries.getSingleByEServiceTemplateId(eserviceTemplateId as string),
    enabled: isEserviceFromTemplate,
  })

  return (
    <Stack spacing={2}>
      {eserviceTemplate ? (
        <>
          <SummaryInformationContainer
            label={t('templateInfo.name.label')}
            content={eserviceTemplate.name}
          />
          <SummaryInformationContainer
            label={t('templateInfo.appearAs.label')}
            content={descriptor.eservice.name}
          />
          <SummaryInformationContainer
            label={t('templateInfo.addressedTo.label')}
            content={eserviceTemplate.intendedTarget}
          />
          <SummaryInformationContainer
            label={t('templateInfo.allowWhat.label')}
            content={eserviceTemplate.description}
          />
        </>
      ) : (
        <SummaryInformationContainer
          label={t('description.label')}
          content={descriptor.eservice.description}
        />
      )}
      <SummaryInformationContainer
        label={t('apiTechnology.label')}
        content={descriptor.eservice.technology}
      />
      <SummaryInformationContainer
        label={t('exchangeType.label')}
        content={t(`exchangeType.value.${descriptor.eservice.asyncExchange ? 'async' : 'sync'}`)}
      />
      {isEserviceFromTemplate && (
        <SummaryInformationContainer
          label={t('mode.label')}
          content={t(`mode.value.${descriptor.eservice.mode}`)}
        />
      )}
      <SummaryInformationContainer
        label={t(`personalDataField.${descriptor.eservice.mode}.label`)}
        content={t(`personalDataField.value.${descriptor.eservice.personalData}`)}
      />
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
