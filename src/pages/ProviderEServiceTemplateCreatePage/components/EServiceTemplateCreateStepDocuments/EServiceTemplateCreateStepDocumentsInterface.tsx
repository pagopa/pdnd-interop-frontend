import React from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useTranslation } from 'react-i18next'
import { Stack, Box, Button } from '@mui/material'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { Document } from '@/api/api.generatedTypes'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { TemplateDownloads } from '@/api/template/template.downloads'
import { TemplateMutations } from '@/api/template'

type EServiceTemplateCreateStepDocumentsInterfaceFormValues = {
  interfaceDoc: File | null
  prettyName: string
}

export function EServiceTemplateCreateStepDocumentsInterface() {
  const { t } = useTranslation('template')
  const { template: templateVersion } = useEServiceTemplateCreateContext()
  const downloadDocument = TemplateDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = TemplateMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = TemplateMutations.usePostVersionDraftDocument()

  const defaultValues: EServiceTemplateCreateStepDocumentsInterfaceFormValues = {
    interfaceDoc: null,
    prettyName: t('create.step4.interface.prettyName'),
  }

  const actualInterface: Document | null =
    (templateVersion?.interface as unknown as Document) ?? null // TODO: This has

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  })

  const onSubmit = ({
    interfaceDoc,
    prettyName,
  }: EServiceTemplateCreateStepDocumentsInterfaceFormValues) => {
    if (!interfaceDoc || !templateVersion) return
    uploadDocument({
      eServiceTemplateId: templateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: templateVersion.id,
      doc: interfaceDoc,
      prettyName,
      kind: 'INTERFACE',
    })
  }

  const handleDeleteInterface = () => {
    if (!actualInterface || !templateVersion) return
    deleteDocument({
      eServiceTemplateId: templateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: templateVersion.id,
      documentId: actualInterface.id,
    })
  }

  const handleDownloadInterface = () => {
    if (!actualInterface || !templateVersion) return
    downloadDocument(
      {
        eServiceTemplateId: templateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: templateVersion.id,
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
