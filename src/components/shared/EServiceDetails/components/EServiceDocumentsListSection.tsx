import type { EServiceDoc } from '@/api/api.generatedTypes'
import { EServiceDownloads } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import React from 'react'
import { DownloadableDocumentsList } from '../../DownloadableDocumentsList'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'

export const EServiceDocumentsListSection: React.FC = () => {
  const { descriptor, docs } = useEServiceDetailsContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

  const handleDownloadDocument = (document: EServiceDoc) => {
    if (!descriptor) return

    downloadDocument(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  return <DownloadableDocumentsList docs={docs} onDocumentDownload={handleDownloadDocument} />
}
