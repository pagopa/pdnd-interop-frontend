import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { UploadDocumentsInterface } from '@/components/shared/UploadDocumentsInterface'

type EServiceTemplateCreateStepVersionDocFormValues = {
  interfaceDoc: File | null
}

export function EServiceTemplateCreateStepVersionDoc() {
  const { eserviceTemplateVersion } = useEServiceTemplateCreateContext()
  const downloadDocument = EServiceTemplateDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceTemplateMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceTemplateMutations.usePostVersionDraftDocument()

  const docs = eserviceTemplateVersion?.docs ?? []
  const uploadedDoc = docs[0] ?? null

  const onSubmit = ({ interfaceDoc }: EServiceTemplateCreateStepVersionDocFormValues) => {
    if (!interfaceDoc || !eserviceTemplateVersion) return
    uploadDocument({
      eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: eserviceTemplateVersion.id,
      doc: interfaceDoc,
      prettyName: interfaceDoc.name,
      kind: 'DOCUMENT',
    })
  }

  const handleDeleteDocument = () => {
    if (!uploadedDoc || !eserviceTemplateVersion) return
    deleteDocument({
      eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: eserviceTemplateVersion.id,
      documentId: uploadedDoc.id,
    })
  }

  const handleDownloadDocument = () => {
    if (!uploadedDoc || !eserviceTemplateVersion) return
    downloadDocument(
      {
        eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplateVersion.id,
        documentId: uploadedDoc.id,
      },
      getDownloadDocumentName(uploadedDoc)
    )
  }

  if (uploadedDoc) {
    return (
      <DocumentContainer
        doc={uploadedDoc}
        onDelete={handleDeleteDocument}
        onDownload={handleDownloadDocument}
      />
    )
  }

  return <UploadDocumentsInterface onSubmit={onSubmit} />
}
