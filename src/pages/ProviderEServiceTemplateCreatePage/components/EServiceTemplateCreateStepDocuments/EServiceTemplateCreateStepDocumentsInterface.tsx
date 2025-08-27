import React from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useTranslation } from 'react-i18next'
import { Stack, Box, Button } from '@mui/material'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'

type EServiceTemplateCreateStepDocumentsInterfaceFormValues = {
  interfaceDoc: File | null
  prettyName: string
}

export function EServiceTemplateCreateStepDocumentsInterface() {
  const { t } = useTranslation('eserviceTemplate')
  const { eserviceTemplateVersion } = useEServiceTemplateCreateContext()
  const downloadDocument = EServiceTemplateDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceTemplateMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceTemplateMutations.usePostVersionDraftDocument()

  const defaultValues: EServiceTemplateCreateStepDocumentsInterfaceFormValues = {
    interfaceDoc: null,
    prettyName: t('create.step4.interface.prettyName'),
  }

  const actualInterface: EServiceDoc | null = eserviceTemplateVersion?.interface ?? null

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  })

  const onSubmit = ({
    interfaceDoc,
    prettyName,
  }: EServiceTemplateCreateStepDocumentsInterfaceFormValues) => {
    if (!interfaceDoc || !eserviceTemplateVersion) return
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
    <FormProvider {...formMethods}>
      <Box
        component="form"
        noValidate
        onSubmit={formMethods.handleSubmit(onSubmit)}
        sx={{ px: 2, py: 2, borderLeft: 4, borderColor: 'primary.main' }}
        bgcolor="common.white"
      >
        <RHFSingleFileInput sx={{ my: 0 }} name="interfaceDoc" rules={{ required: true }} />

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
