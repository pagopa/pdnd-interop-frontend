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
import type { EServiceDoc } from '@/api/api.generatedTypes'
import AddIcon from '@mui/icons-material/Add'
import { useCreateContext } from '../../CreateContext'
import { TemplateDownloads } from '@/api/template/template.downloads'
import { TemplateMutations } from '@/api/template'

type CreateStepDocumentsDocFormValues = {
  doc: File | null
  prettyName: string
}

const defaultValues: CreateStepDocumentsDocFormValues = {
  doc: null,
  prettyName: '',
}

export function CreateStepDocumentsDoc() {
  const { t } = useTranslation('eservice') //TODO
  const { t: tCommon } = useTranslation('common')
  const { descriptor, template } = useCreateContext()

  const downloadEServiceDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mutate: deleteEServiceDocument } = EServiceMutations.useDeleteVersionDraftDocument()
  const { mutate: updateEServiceDocumentName } =
    EServiceMutations.useUpdateVersionDraftDocumentDescription()
  const { mutate: uploadEServiceDocument } = EServiceMutations.usePostVersionDraftDocument()

  const downloadTemplateDocument = TemplateDownloads.useDownloadVersionDocument()
  const { mutate: deleteTemplateDocument } = TemplateMutations.useDeleteVersionDraftDocument()
  const { mutate: updateTemplateDocumentName } =
    TemplateMutations.useUpdateVersionDraftDocumentDescription()
  const { mutate: uploadTemplateDocument } = TemplateMutations.usePostVersionDraftDocument()

  const docs = (descriptor?.docs || template?.docs) ?? []

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
    if (!doc || (!descriptor && !template)) return //TODO
    if (descriptor) {
      uploadEServiceDocument(
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
    if (template) {
      uploadTemplateDocument(
        {
          eserviceTemplateId: template.eservice.id,
          doc,
          prettyName,
          kind: 'DOCUMENT',
        },
        { onSuccess: handleHideFileInput }
      )
    }
  }

  const handleUpdateDescription = (documentId: string, prettyName: string) => {
    if (!descriptor && !template) return
    if (descriptor) {
      updateEServiceDocumentName({
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId,
        prettyName,
      })
    }
    if (template) {
      updateTemplateDocumentName({
        eserviceTemplateId: template.eservice.id,
        documentId,
        prettyName,
      })
    }
  }

  const handleDeleteDocument = (document: EServiceDoc) => {
    if (!descriptor && !template) return
    if (descriptor) {
      deleteEServiceDocument({
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: document.id,
      })
    }
    if (template) {
      deleteTemplateDocument({
        templateId: template.eservice.id, //TODO UNIFORMARE NOMI PROPRIETà
        documentId: document.id,
      })
    }
  }

  const handleDownloadDocument = (document: EServiceDoc) => {
    if (!descriptor && !template) return
    if (descriptor) {
      downloadEServiceDocument(
        {
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
          documentId: document.id,
        },
        getDownloadDocumentName(document)
      )
    }
    if (template) {
      downloadTemplateDocument(
        {
          templateId: template.eservice.id,
          documentId: document.id,
        },
        getDownloadDocumentName(document)
      )
    }
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
