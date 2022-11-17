import { EServiceMutations } from '@/api/eservice'
import { DocumentRead } from '@/types/common.types'
import React from 'react'
import { DownloadableDocumentsList } from '../../DownloadableDocumentsList'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'

export const EServiceDocumentsListSection: React.FC = () => {
  const { eservice, docs } = useEServiceDetailsContext()
  const { mutate: downloadDocument } = EServiceMutations.useDownloadVersionDocument()

  const handleDownloadDocument = (document: DocumentRead) => {
    if (!eservice || !eservice?.viewingDescriptor) return

    downloadDocument({
      eserviceId: eservice.id,
      descriptorId: eservice.viewingDescriptor.id,
      document,
    })
  }

  return <DownloadableDocumentsList docs={docs} onDocumentDownload={handleDownloadDocument} />
}
