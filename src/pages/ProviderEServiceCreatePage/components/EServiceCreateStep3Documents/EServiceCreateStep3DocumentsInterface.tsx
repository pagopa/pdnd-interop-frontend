import React from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useTranslation } from 'react-i18next'
import { Stack, Box, Button } from '@mui/material'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { EServiceDownloads, EServiceMutations } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'

type EServiceCreateStep3DocumentsInterfaceFormValues = {
  interfaceDoc: File | null
  prettyName: string
}

export function EServiceCreateStep3DocumentsInterface() {
  const { t } = useTranslation('eservice')
  const { descriptor } = useEServiceCreateContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceMutations.usePostVersionDraftDocument()

  const defaultValues: EServiceCreateStep3DocumentsInterfaceFormValues = {
    interfaceDoc: null,
    prettyName: t('create.step3.interface.prettyName'),
  }

  const actualInterface: EServiceDoc | null = descriptor?.interface ?? null

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  })

  const onSubmit = ({
    interfaceDoc,
    prettyName,
  }: EServiceCreateStep3DocumentsInterfaceFormValues) => {
    if (!interfaceDoc || !descriptor) return
    uploadDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      doc: interfaceDoc,
      prettyName,
      kind: 'INTERFACE',
    })
  }

  const handleDeleteInterface = () => {
    if (!actualInterface || !descriptor) return
    deleteDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      documentId: actualInterface.id,
    })
  }

  const handleDownloadInterface = () => {
    if (!actualInterface || !descriptor) return
    downloadDocument(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: actualInterface.id,
      },
      getDownloadDocumentName(actualInterface)
    )
  }

  if (actualInterface) {
    return (
      <DocumentContainer
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
          label={t('create.step3.uploadFileField.label')}
          rules={{ required: true }}
        />

        <RHFTextField
          sx={{ my: 2 }}
          name="prettyName"
          label={t('create.step3.nameField.label')}
          disabled
          rules={{ required: true }}
        />

        <Stack direction="row" justifyContent="flex-end">
          <Button type="submit" variant="contained">
            <UploadFileIcon fontSize="small" sx={{ mr: 1 }} /> {t('create.step3.uploadBtn')}
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  )
}
