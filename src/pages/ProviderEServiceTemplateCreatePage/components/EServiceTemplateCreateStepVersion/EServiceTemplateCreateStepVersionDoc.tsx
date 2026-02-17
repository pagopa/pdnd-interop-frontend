import React from 'react'
import { Stack, Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { UploadDocumentsInterface } from '@/components/shared/UploadDocumentsInterface'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import AddIcon from '@mui/icons-material/Add'

type EServiceTemplateCreateStepVersionDocFormValues = {
  interfaceDoc: File | null
}

export function EServiceTemplateCreateStepVersionDoc() {
  const { t: tCommon } = useTranslation('common')
  const { eserviceTemplateVersion } = useEServiceTemplateCreateContext()
  const downloadDocument = EServiceTemplateDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceTemplateMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceTemplateMutations.usePostVersionDraftDocument()

  const docs = eserviceTemplateVersion?.docs ?? []

  const [showUploadInput, setShowUploadInput] = React.useState(false)

  const handleShowUploadInput = () => {
    setShowUploadInput(true)
  }
  const handleHideUploadInput = () => {
    setShowUploadInput(false)
  }

  const onSubmit = ({ interfaceDoc }: EServiceTemplateCreateStepVersionDocFormValues) => {
    if (!interfaceDoc || !eserviceTemplateVersion) return
    uploadDocument(
      {
        eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplateVersion.id,
        doc: interfaceDoc,
        prettyName: interfaceDoc.name,
        kind: 'DOCUMENT',
      },
      { onSuccess: handleHideUploadInput }
    )
  }

  const handleDeleteDocument = (document: EServiceDoc) => {
    if (!eserviceTemplateVersion) return
    deleteDocument({
      eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: eserviceTemplateVersion.id,
      documentId: document.id,
    })
  }

  const handleDownloadDocument = (document: EServiceDoc) => {
    if (!eserviceTemplateVersion) return
    downloadDocument(
      {
        eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplateVersion.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  return (
    <Box>
      <Stack spacing={2} sx={{ mt: docs.length > 0 ? 3 : 0, mb: docs.length > 0 ? 2 : 0 }}>
        {docs.map((doc) => (
          <DocumentContainer
            key={doc.id}
            doc={doc}
            onDelete={handleDeleteDocument}
            onDownload={handleDownloadDocument}
          />
        ))}
      </Stack>

      {showUploadInput ? (
        <UploadDocumentsInterface onSubmit={onSubmit} />
      ) : (
        <Button
          startIcon={<AddIcon fontSize="small" />}
          size="small"
          variant="text"
          onClick={handleShowUploadInput}
        >
          {tCommon('addBtn')}
        </Button>
      )}
    </Box>
  )
}
