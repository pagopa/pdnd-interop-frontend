import React from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Stack, Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import AddIcon from '@mui/icons-material/Add'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { TemplateDownloads } from '@/api/template/template.downloads'
import { TemplateMutations } from '@/api/template'

type EServiceTemplateCreateStepDocumentsDocFormValues = {
  doc: File | null
  prettyName: string
}

const defaultValues: EServiceTemplateCreateStepDocumentsDocFormValues = {
  doc: null,
  prettyName: '',
}

export function EServiceTemplateCreateStepDocumentsDoc() {
  const { t } = useTranslation('template')
  const { t: tCommon } = useTranslation('common')
  const { templateVersion } = useEServiceTemplateCreateContext()
  const downloadDocument = TemplateDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = TemplateMutations.useDeleteVersionDraftDocument()
  const { mutate: updateDocumentName } =
    TemplateMutations.useUpdateVersionDraftDocumentDescription()
  const { mutate: uploadDocument } = TemplateMutations.usePostVersionDraftDocument()

  const docs = templateVersion?.docs ?? []

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

  const onSubmit = ({ doc, prettyName }: EServiceTemplateCreateStepDocumentsDocFormValues) => {
    if (!doc || !templateVersion) return
    uploadDocument(
      {
        eServiceTemplateId: templateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: templateVersion.id,
        doc,
        prettyName,
        kind: 'DOCUMENT',
      },
      { onSuccess: handleHideFileInput }
    )
  }

  const handleUpdateDescription = (documentId: string, prettyName: string) => {
    if (!templateVersion) return
    updateDocumentName({
      eServiceTemplateId: templateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: templateVersion.id,
      documentId,
      prettyName,
    })
  }

  const handleDeleteDocument = (document: EServiceDoc) => {
    if (!templateVersion) return
    deleteDocument({
      eServiceTemplateId: templateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: templateVersion.id,
      documentId: document.id,
    })
  }

  const handleDownloadDocument = (document: EServiceDoc) => {
    if (!templateVersion) return
    downloadDocument(
      {
        eServiceTemplateId: templateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: templateVersion.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  return (
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
  )
}
