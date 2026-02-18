import React from 'react'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { EServiceQueries, EServiceDownloads } from '@/api/eservice'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { IconLink } from '@/components/shared/IconLink'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { ProviderEServiceInformationContainer } from './ProviderEServiceInformationContainer'

export const ProviderEServiceVersionInfoSummary: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.versionInfoSummary' })
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
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

  const hasManualApproval = descriptor.agreementApprovalPolicy === 'MANUAL'

  return (
    <Stack spacing={3}>
      <ProviderEServiceInformationContainer
        label={t('description.label')}
        content={descriptor.description}
      />
      {descriptor.docs.map((doc, index) => (
        <ProviderEServiceInformationContainer
          key={doc.id}
          label={index === 0 ? t('documentation') : ''}
          content={
            <IconLink
              component="button"
              startIcon={<AttachFileIcon fontSize="small" />}
              onClick={handleDownloadDocument.bind(null, doc)}
            >
              {doc.prettyName}
            </IconLink>
          }
        />
      ))}
      <ProviderEServiceInformationContainer
        label={t('manualApproval.label')}
        content={t(`manualApproval.value.${hasManualApproval}`)}
      />
    </Stack>
  )
}
