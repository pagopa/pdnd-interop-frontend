import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Stack } from '@mui/material'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput } from '@/components/shared/react-hook-form-inputs'
import { EServiceDownloads, EServiceMutations } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'

type EServiceCreateStepDocumentsInterfaceFormValues = {
  interfaceDoc: File | null
}

export function EServiceCreateStepDocumentsInterface() {
  const { t } = useTranslation('eservice')
  const { descriptor } = useEServiceCreateContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceMutations.usePostVersionDraftDocument()

  const defaultValues: EServiceCreateStepDocumentsInterfaceFormValues = {
    interfaceDoc: null,
  }

  const actualInterface: EServiceDoc | null = descriptor?.interface ?? null

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  })

  const onSubmit = ({ interfaceDoc }: EServiceCreateStepDocumentsInterfaceFormValues) => {
    if (!interfaceDoc || !descriptor) return

    const prettyName = t('create.step4.interface.prettyName')

    uploadDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      doc: interfaceDoc,
      prettyName: `${prettyName}_${descriptor.eservice.id}`,
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
        sx={{ mt: 4 }}
        doc={actualInterface}
        onDelete={handleDeleteInterface}
        onDownload={handleDownloadInterface}
        size="small"
      />
    )
  }

  const selectedInterface = formMethods.watch('interfaceDoc')

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate sx={{ py: 2 }} onSubmit={formMethods.handleSubmit(onSubmit)}>
        <RHFSingleFileInput sx={{ my: 0 }} name="interfaceDoc" rules={{ required: true }} />

        {selectedInterface && (
          <Stack direction="row" justifyContent="flex-start" mt={3}>
            <Button type="submit" variant="contained">
              {t('create.step4.uploadBtn')}
            </Button>
          </Stack>
        )}
      </Box>
    </FormProvider>
  )
}
