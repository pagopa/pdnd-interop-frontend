import React from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Stack, Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { EServiceDownloads, EServiceMutations } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { Document } from '@/api/api.generatedTypes'
import AddIcon from '@mui/icons-material/Add'
import { IconLink } from '@/components/shared/IconLink'
import DownloadIcon from '@mui/icons-material/Download'

type EServiceCreateStepDocumentsDocFormValues = {
  doc: File | null
  prettyName: string
}

const defaultValues: EServiceCreateStepDocumentsDocFormValues = {
  doc: null,
  prettyName: '',
}

type EServiceCreateStepDocumentsDocProps = {
  readonly?: boolean
}

export const EServiceCreateStepDocumentsDoc: React.FC<EServiceCreateStepDocumentsDocProps> = ({
  readonly = false,
}) => {
  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common')
  const { descriptor } = useEServiceCreateContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceMutations.useDeleteVersionDraftDocument()
  const { mutate: updateDocumentName } =
    EServiceMutations.useUpdateVersionDraftDocumentDescription()
  const { mutate: uploadDocument } = EServiceMutations.usePostVersionDraftDocument()

  const docs = (descriptor?.docs ?? []) as unknown as Document[] // TODO: This will updated with new version of BFF

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

  const onSubmit = ({ doc, prettyName }: EServiceCreateStepDocumentsDocFormValues) => {
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

  const handleDeleteDocument = (document: Document) => {
    if (!descriptor) return
    deleteDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      documentId: document.id,
    })
  }

  const handleDownloadDocument = (document: Document) => {
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

  return !readonly ? (
    <Box>
      <Stack spacing={2} sx={{ mt: 4, mb: docs.length > 0 ? 2 : 0 }}>
        {docs.length > 0 &&
          docs.map((doc) => (
            <DocumentContainer
              key={doc.id}
              doc={doc}
              onUpdateDescription={handleUpdateDescription.bind(null, doc.id)}
              onDelete={handleDeleteDocument}
              onDownload={handleDownloadDocument}
            />
          ))}
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
              size="small"
              sx={{ my: 2 }}
              name="prettyName"
              label={t('create.step4.nameField.label')}
              infoLabel={t('create.step4.nameField.infoLabel')}
              inputProps={{ maxLength: 60 }}
              rules={{ required: true, minLength: 5 }}
            />

            <Stack direction="row" justifyContent="flex-end">
              <Button type="submit" variant="contained">
                <UploadFileIcon fontSize="small" sx={{ mr: 1 }} /> {t('create.step4.uploadBtn')}
              </Button>
            </Stack>
          </Box>
        </FormProvider>
      ) : (
        <Button
          startIcon={<AddIcon fontSize="small" />}
          size="small"
          variant="text"
          onClick={handleShowFileInput}
        >
          {tCommon('addBtn')}
        </Button>
      )}
    </Box>
  ) : (
    <EServiceCreateStepDocumentDocReadonly
      docs={docs}
      handleDownloadDocument={handleDownloadDocument}
    />
  )
}

const EServiceCreateStepDocumentDocReadonly: React.FC<{
  docs: Document[]
  handleDownloadDocument: (document: Document) => void
}> = ({ docs, handleDownloadDocument }) =>
  docs.map((doc) => (
    <Stack key={doc.id} alignItems="start" mb={2}>
      <IconLink
        fontWeight={600}
        key="test"
        component="button"
        onClick={() => handleDownloadDocument(doc)}
        endIcon={<DownloadIcon sx={{ ml: 1 }} fontSize="small" />}
      >
        {doc.prettyName}
      </IconLink>
    </Stack>
  ))
