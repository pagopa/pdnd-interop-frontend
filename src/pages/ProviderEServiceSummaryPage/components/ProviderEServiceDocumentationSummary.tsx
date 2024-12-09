import React from 'react'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { EServiceDownloads, EServiceQueries } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'

export const ProviderEServiceDocumentationSummary: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.documentationSummary' })
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

  if (!descriptor) return null
  if (!descriptor.interface && descriptor.docs.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        {t('emptyLabel')}
      </Typography>
    )

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
