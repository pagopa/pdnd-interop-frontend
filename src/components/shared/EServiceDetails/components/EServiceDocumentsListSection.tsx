import { EServiceMutations } from '@/api/eservice'
import { DocumentRead } from '@/types/common.types'
import React from 'react'
import { DownloadableDocumentsList } from '../../DownloadableDocumentsList'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'

export const EServiceDocumentsListSection: React.FC = () => {
  const { descriptor, docs } = useEServiceDetailsContext()
  const { mutate: downloadDocument } = EServiceMutations.useDownloadVersionDocument()

  const handleDownloadDocument = (document: DocumentRead) => {
    if (!descriptor) return

    downloadDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      document,
    })
  }

  return <DownloadableDocumentsList docs={docs} onDocumentDownload={handleDownloadDocument} />
}
