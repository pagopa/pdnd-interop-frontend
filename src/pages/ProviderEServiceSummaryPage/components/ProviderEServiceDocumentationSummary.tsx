import React from 'react'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { EServiceDownloads, EServiceQueries } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ProviderEServiceInformationContainer } from './ProviderEServiceInformationContainer'
import { secondsToMinutes } from '@/utils/format.utils'

export const ProviderEServiceDocumentationSummary: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.documentationSummary' })
  const { t: tCommon } = useTranslation('common')
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const voucherLifespan = secondsToMinutes(descriptor.voucherLifespan)

  const handleDownloadDocument = (document: EServiceDoc) => {
    downloadDocument(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  return (
    <Stack spacing={2}>
      <ProviderEServiceInformationContainer
        label={t('interface.label')}
        content={
          descriptor.interface && (
            <IconLink
              component="button"
              startIcon={<AttachFileIcon fontSize="small" />}
              onClick={handleDownloadDocument.bind(null, descriptor.interface)}
            >
              {descriptor.interface.prettyName}
            </IconLink>
          )
        }
      />
      <ProviderEServiceInformationContainer
        label={t('audience.label')}
        content={descriptor.audience[0]}
      />
      <ProviderEServiceInformationContainer
        label={t('voucherLifespan.label')}
        content={`${voucherLifespan} ${tCommon('time.minute', {
          count: voucherLifespan,
        })}`}
      />
    </Stack>
  )
}
