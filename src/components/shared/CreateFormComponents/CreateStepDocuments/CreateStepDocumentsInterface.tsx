import React from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useTranslation } from 'react-i18next'
import { Stack, Box, Button } from '@mui/material'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { EServiceDownloads, EServiceMutations } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { useCreateContext } from '../../CreateContext'
import { TemplateDownloads } from '@/api/template/template.downloads'
import { TemplateMutations } from '@/api/template'

type CreateStepDocumentsInterfaceFormValues = {
  interfaceDoc: File | null
  prettyName: string
}

export function CreateStepDocumentsInterface() {
  const { t } = useTranslation('eservice') //TODO
  const { descriptor, template } = useCreateContext()
  const downloadEServiceDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mutate: deleteEServiceDocument } = EServiceMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadEServiceDocument } = EServiceMutations.usePostVersionDraftDocument()
  const downloadTemplateDocument = TemplateDownloads.useDownloadVersionDocument()
  const { mutate: deleteTemplateDocument } = TemplateMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadTemplateDocument } = TemplateMutations.usePostVersionDraftDocument()

  const defaultValues: CreateStepDocumentsInterfaceFormValues = {
    interfaceDoc: null,
    prettyName: t('create.step4.interface.prettyName'),
  }

  const actualInterface: EServiceDoc | null = (descriptor?.interface || template?.interface) ?? null

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  })

  const onSubmit = ({ interfaceDoc, prettyName }: CreateStepDocumentsInterfaceFormValues) => {
    if (!interfaceDoc || (!descriptor && !template)) return //TODO
    if (descriptor) {
      uploadEServiceDocument({
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        doc: interfaceDoc,
        prettyName,
        kind: 'INTERFACE',
      })
    }
    if (template) {
      uploadTemplateDocument({
        eserviceTemplateId: template.eservice.id,
        doc: interfaceDoc,
        prettyName,
        kind: 'INTERFACE',
      })
    }
  }

  const handleDeleteInterface = () => {
    if (!actualInterface || (!descriptor && !template)) return //TODO
    if (descriptor) {
      deleteEServiceDocument({
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: actualInterface.id,
      })
    }
    if (template) {
      deleteTemplateDocument({
        templateId: template.eservice.id,
        documentId: actualInterface.id,
      })
    }
  }

  const handleDownloadInterface = () => {
    if (!actualInterface || (!descriptor && !template)) return //TODO
    if (descriptor) {
      downloadEServiceDocument(
        {
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
          documentId: actualInterface.id,
        },
        getDownloadDocumentName(actualInterface)
      )
    }
    if (template) {
      downloadTemplateDocument(
        {
          templateId: template.eservice.id,
          documentId: actualInterface.id,
        },
        getDownloadDocumentName(actualInterface)
      )
    }
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
    <FormProvider {...formMethods}>
      <Box
        component="form"
        noValidate
        onSubmit={formMethods.handleSubmit(onSubmit)}
        sx={{ px: 2, py: 2, borderLeft: 4, borderColor: 'primary.main' }}
        bgcolor="common.white"
      >
        <RHFSingleFileInput
          sx={{ my: 0 }}
          name="interfaceDoc"
          label={t('create.step4.uploadFileField.label')}
          rules={{ required: true }}
        />

        <RHFTextField
          size="small"
          sx={{ my: 2 }}
          name="prettyName"
          label={t('create.step4.nameField.label')}
          disabled
          rules={{ required: true }}
        />

        <Stack direction="row" justifyContent="flex-end">
          <Button type="submit" variant="contained" startIcon={<UploadFileIcon fontSize="small" />}>
            {t('create.step4.uploadBtn')}
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  )
}
