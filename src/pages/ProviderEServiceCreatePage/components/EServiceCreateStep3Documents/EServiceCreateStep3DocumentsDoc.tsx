import React from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Alert, Stack, Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { EServiceDownloads, EServiceMutations } from '@/api/eservice'
import type { DocumentRead } from '@/types/common.types'
import { getDownloadDocumentName } from '@/utils/eservice.utils'

type EServiceCreateStep3DocumentsDocFormValues = {
  doc: File | null
  prettyName: string
}

const defaultValues: EServiceCreateStep3DocumentsDocFormValues = {
  doc: null,
  prettyName: '',
}

export function EServiceCreateStep3DocumentsDoc() {
  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common')
  const { descriptor } = useEServiceCreateContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceMutations.useDeleteVersionDraftDocument()
  const { mutate: updateDocumentName } =
    EServiceMutations.useUpdateVersionDraftDocumentDescription()
  const { mutate: uploadDocument } = EServiceMutations.usePostVersionDraftDocument()

  const docs = descriptor?.docs ?? []

  const [showWriteDocInput, setShowWriteDocInput] = React.useState(false)

  const handleShowFileInput = () => {
    setShowWriteDocInput(true)
  }
  const handleHideFileInput = () => {
    setShowWriteDocInput(false)
  }

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  })

  const onSubmit = ({ doc, prettyName }: EServiceCreateStep3DocumentsDocFormValues) => {
    if (!doc || !descriptor) return
    uploadDocument(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        doc,
        prettyName,
        kind: 'DOCUMENT',
      },
      { onSuccess: handleHideFileInput }
    )
  }

  const handleUpdateDescription = (documentId: string, prettyName: string) => {
    if (!descriptor) return
    updateDocumentName({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      documentId,
      prettyName,
    })
  }

  const handleDeleteDocument = (document: DocumentRead) => {
    if (!descriptor) return
    deleteDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      documentId: document.id,
    })
  }

  const handleDownloadDocument = (document: DocumentRead) => {
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

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={2} sx={{ mb: 3 }}>
        {docs.length > 0 ? (
          docs.map((doc) => (
            <DocumentContainer
              key={doc.id}
              doc={doc}
              onUpdateDescription={handleUpdateDescription.bind(null, doc.id)}
              onDelete={handleDeleteDocument}
              onDownload={handleDownloadDocument}
            />
          ))
        ) : (
          <Alert severity="info">{t('create.step3.documentation.noFileUploaded')}</Alert>
        )}
      </Stack>

      {showWriteDocInput ? (
        <FormProvider {...formMethods}>
          <Box
            component="form"
            noValidate
            onSubmit={formMethods.handleSubmit(onSubmit)}
            sx={{ px: 2, py: 2, borderLeft: 4, borderColor: 'primary.main' }}
            bgcolor="common.white"
          >
            <RHFSingleFileInput sx={{ my: 0 }} name="doc" rules={{ required: true }} />

            <RHFTextField
              sx={{ my: 2 }}
              name="prettyName"
              label={t('create.step3.nameField.label')}
              infoLabel={t('create.step3.nameField.infoLabel')}
              inputProps={{ maxLength: 60 }}
              rules={{ required: true, minLength: 5 }}
            />

            <Stack direction="row" justifyContent="flex-end">
              <Button type="submit" variant="contained">
                <UploadFileIcon fontSize="small" sx={{ mr: 1 }} /> {t('create.step3.uploadBtn')}
              </Button>
            </Stack>
          </Box>
        </FormProvider>
      ) : (
        <Button variant="contained" size="small" onClick={handleShowFileInput}>
          {tCommon('addBtn')}
        </Button>
      )}
    </Box>
  )
}
