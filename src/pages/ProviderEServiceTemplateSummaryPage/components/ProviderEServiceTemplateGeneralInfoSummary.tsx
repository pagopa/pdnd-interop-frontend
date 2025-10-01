import React from 'react'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'

export const ProviderEServiceTemplateGeneralInfoSummary: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'summary.generalInfoSummary' })
  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()

  const { data: eserviceTemplate } = useSuspenseQuery(
    EServiceTemplateQueries.getSingle(params.eServiceTemplateId, params.eServiceTemplateVersionId)
  )

  return (
    <Stack spacing={2}>
      <InformationContainer
        label={t('description.label')}
        content={eserviceTemplate.eserviceTemplate.description}
      />
      <InformationContainer
        label={t('apiTechnology.label')}
        content={eserviceTemplate.eserviceTemplate.technology}
      />
      <InformationContainer
        label={t(`personalDataField.${eserviceTemplate.eserviceTemplate.mode}.label`)}
        content={t(`personalDataField.value.${eserviceTemplate.eserviceTemplate.personalData}`)}
      />
      <InformationContainer
        label={t('isSignalHubEnabled.label')}
        content={t(
          `isSignalHubEnabled.value.${eserviceTemplate.eserviceTemplate.isSignalHubEnabled}`
        )}
      />
    </Stack>
  )
}
