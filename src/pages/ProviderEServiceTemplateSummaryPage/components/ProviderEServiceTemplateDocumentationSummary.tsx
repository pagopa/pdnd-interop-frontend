import React from 'react'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { TemplateQueries } from '@/api/template'
import { TemplateDownloads } from '@/api/template/template.downloads'

export const ProviderEServiceTemplateDocumentationSummary: React.FC = () => {
  const { t } = useTranslation('template', { keyPrefix: 'summary.documentationSummary' })
  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()

  const { data: template } = useSuspenseQuery(
    TemplateQueries.getSingle(params.eServiceTemplateId, params.eServiceTemplateVersionId)
  )

  const downloadDocument = TemplateDownloads.useDownloadVersionDocument()

  if (!template) return null
  if (!template.interface && template.docs.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        {t('emptyLabel')}
      </Typography>
    )

  const handleDownloadDocument = (document: EServiceDoc) => {
    downloadDocument(
      {
        eServiceTemplateId: template.eserviceTemplate.id,
        eServiceTemplateVersionId: template.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  return (
    <Stack spacing={0.5} alignItems="start">
      {template.interface && (
        <IconLink
          component="button"
          startIcon={<AttachFileIcon fontSize="small" />}
          onClick={handleDownloadDocument.bind(null, template.interface)}
        >
          {t('interface.label')}
        </IconLink>
      )}
      {template.docs.map((doc) => (
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
