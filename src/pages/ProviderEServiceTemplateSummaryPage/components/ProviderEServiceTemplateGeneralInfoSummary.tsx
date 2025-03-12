import React from 'react'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { FEATURE_FLAG_SIGNALHUB_WHITELIST, SIGNALHUB_WHITELIST_PRODUCER } from '@/config/env'
import { AuthHooks } from '@/api/auth'
import { TemplateQueries } from '@/api/template'

export const ProviderEServiceTemplateGeneralInfoSummary: React.FC = () => {
  const producerId = AuthHooks.useJwt().jwt?.organizationId as string
  const isSignalHubFlagEnabled = FEATURE_FLAG_SIGNALHUB_WHITELIST
    ? SIGNALHUB_WHITELIST_PRODUCER.includes(producerId)
    : true

  const { t } = useTranslation('template', { keyPrefix: 'summary.generalInfoSummary' })
  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()

  const { data: template } = useSuspenseQuery(
    TemplateQueries.getSingle(params.eServiceTemplateId, params.eServiceTemplateVersionId)
  )

  return (
    <Stack spacing={2}>
      <InformationContainer
        label={t('description.label')}
        content={template.eserviceTemplate.description}
      />
      <InformationContainer
        label={t('apiTechnology.label')}
        content={template.eserviceTemplate.technology}
      />
      {isSignalHubFlagEnabled && (
        <InformationContainer
          label={t('isSignalHubEnabled.label')}
          content={t(`isSignalHubEnabled.value.${template.eserviceTemplate.isSignalHubEnabled}`)}
        />
      )}
    </Stack>
  )
}
