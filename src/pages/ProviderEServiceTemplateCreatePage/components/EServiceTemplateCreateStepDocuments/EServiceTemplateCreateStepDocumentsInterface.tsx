import React from 'react'
import { useTranslation } from 'react-i18next'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { UploadDocumentsInterfaceComponent } from '@/components/shared/UploadDocumentsInterfaceComponent'

type EServiceTemplateCreateStepDocumentsInterfaceFormValues = {
  interfaceDoc: File | null
}

export function EServiceTemplateCreateStepDocumentsInterface() {
  const { t } = useTranslation('eserviceTemplate')
  const { eserviceTemplateVersion } = useEServiceTemplateCreateContext()
  const downloadDocument = EServiceTemplateDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceTemplateMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceTemplateMutations.usePostVersionDraftDocument()

  const actualInterface: EServiceDoc | null = eserviceTemplateVersion?.interface ?? null

  const onSubmit = ({ interfaceDoc }: EServiceTemplateCreateStepDocumentsInterfaceFormValues) => {
    if (!interfaceDoc || !eserviceTemplateVersion) return
    const prettyName = t('create.step4.interface.prettyName')
    uploadDocument({
      eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: eserviceTemplateVersion.id,
      doc: interfaceDoc,
      prettyName,
      kind: 'INTERFACE',
    })
  }

  const handleDeleteInterface = () => {
    if (!actualInterface || !eserviceTemplateVersion) return
    deleteDocument({
      eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: eserviceTemplateVersion.id,
      documentId: actualInterface.id,
    })
  }

  const handleDownloadInterface = () => {
    if (!actualInterface || !eserviceTemplateVersion) return
    downloadDocument(
      {
        eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplateVersion.id,
        documentId: actualInterface.id,
      },
      getDownloadDocumentName(actualInterface)
    )
  }

  if (actualInterface) {
    return (
      <DocumentContainer
        sx={{ mt: 4 }}
        doc={actualInterface}
        onDelete={handleDeleteInterface}
        onDownload={handleDownloadInterface}
      />
    )
  }

  return (
    <UploadDocumentsInterfaceComponent
      onSubmit={onSubmit}
      sxBox={{ px: 2, py: 2, borderLeft: 4, borderColor: 'primary.main' }}
    />
  )
}
