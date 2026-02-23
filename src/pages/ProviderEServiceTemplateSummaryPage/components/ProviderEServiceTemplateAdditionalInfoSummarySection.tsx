import React from 'react'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'

export const ProviderEServiceTemplateAdditionalInfoSummarySection: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'summary.additionalInfoSummary',
  })
  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()

  const { data: eserviceTemplate } = useSuspenseQuery(
    EServiceTemplateQueries.getSingle(params.eServiceTemplateId, params.eServiceTemplateVersionId)
  )

  const downloadDocument = EServiceTemplateDownloads.useDownloadVersionDocument()
  const hasManualApproval = eserviceTemplate.agreementApprovalPolicy === 'MANUAL'

  const handleDownloadDocument = (document: EServiceDoc) => {
    downloadDocument(
      {
        eServiceTemplateId: eserviceTemplate.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplate.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  return (
    <Stack spacing={2}>
      <InformationContainer
        label={t('versionDescription.label')}
        content={eserviceTemplate.description ?? 'n/a'}
      />
      <InformationContainer
        label={t('documentation.label')}
        content={
          eserviceTemplate.docs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('emptyDocumentation')}
            </Typography>
          ) : (
            <Stack spacing={0.5} alignItems="start">
              {eserviceTemplate.docs.map((doc) => (
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
      />
      <InformationContainer
        label={t('manualApproval.label')}
        content={t(`manualApproval.value.${hasManualApproval}`)}
      />
    </Stack>
  )
}
