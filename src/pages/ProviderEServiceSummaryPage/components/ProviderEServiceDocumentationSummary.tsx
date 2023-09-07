import React from 'react'
import type { EServiceDoc, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { EServiceDownloads } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'

type ProviderEServiceDocumentationSummaryProps = {
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceDocumentationSummary: React.FC<
  ProviderEServiceDocumentationSummaryProps
> = ({ descriptor }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.documentationSummary' })

  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

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
    <Stack spacing={0.5} alignItems="start">
      {descriptor.interface && (
        <IconLink
          component="button"
          startIcon={<AttachFileIcon fontSize="small" />}
          onClick={handleDownloadDocument.bind(null, descriptor.interface)}
        >
          {t('interface.label')}
        </IconLink>
      )}
      {descriptor.docs.map((doc) => (
        <IconLink
          component="button"
          key={doc.id}
          startIcon={<AttachFileIcon fontSize="small" />}
          onClick={handleDownloadDocument.bind(null, doc)}
        >
          {doc.prettyName}
        </IconLink>
      ))}
    </Stack>
  )
}
