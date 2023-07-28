import React from 'react'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { EServiceDownloads } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { DownloadableDocumentsList } from '../../DownloadableDocumentsList'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'
import { Link } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { useCurrentRoute } from '@/router'
import { useTranslation } from 'react-i18next'

export const EServiceDocumentsListSection: React.FC = () => {
  const { descriptor, docs } = useEServiceDetailsContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mode } = useCurrentRoute()

  const isProvider = mode === 'provider'

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
    <DownloadableDocumentsList
      docs={docs}
      onDocumentDownload={handleDownloadDocument}
      bottomContent={isProvider ? <DownloadConsumerListButton /> : undefined}
    />
  )
}

const DownloadConsumerListButton: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.documentsList' })
  const { descriptor } = useEServiceDetailsContext()
  const downloadConsumerList = EServiceDownloads.useDownloadConsumerList()

  const handleDownloadConsumerList = () => {
    downloadConsumerList(
      { eserviceId: descriptor.eservice.id },
      t('consumerListFileName', {
        timestamp: new Date().toISOString(),
        eserviceName: descriptor.eservice.name,
      })
    )
  }

  return (
    <Link
      onClick={handleDownloadConsumerList}
      component="button"
      variant="body2"
      underline="hover"
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <DownloadIcon sx={{ mr: 1 }} /> {t('consumerListButtonLabel')}
    </Link>
  )
}
