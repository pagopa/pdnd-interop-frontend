import React from 'react'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'

export const ProviderEServiceGeneralInfoSummary: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.generalInfoSummary' })
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(
    params.eserviceId,
    params.descriptorId,
    {
      suspense: false,
    }
  )

  const { data: eservice } = EServiceQueries.useGetSingle(params.eserviceId, {
    suspense: false,
  })

  if (!descriptor && !eservice) return null

  return (
    <Stack spacing={2}>
      <InformationContainer
        label={t('description.label')}
        content={(descriptor?.eservice.description ?? eservice?.description)!}
      />
      <InformationContainer
        label={t('apiTechnology.label')}
        content={(descriptor?.eservice.technology ?? eservice?.technology)!}
      />
    </Stack>
  )
}
