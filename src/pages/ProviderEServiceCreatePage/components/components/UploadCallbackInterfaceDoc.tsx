import { useTranslation } from 'react-i18next'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { EServiceDownloads, EServiceMutations } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { CreateEServiceDocumentPayload, EServiceDoc } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { type SubmitHandler, useForm, FormProvider } from 'react-hook-form'
import { Box, Button, Stack } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import React from 'react'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { RHFSingleFileInput } from '@/components/shared/react-hook-form-inputs'

type UploadCallbackInterfaceDocFormValues = {
  callbackInterfaceDoc: File | null
}

type UploadCallbackInterfaceDocProps = {
  error?: string
}

export const UploadCallbackInterfaceDoc: React.FC<UploadCallbackInterfaceDocProps> = ({
  error,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step4.asyncExchangeSection' })
  const { t: tCommon } = useTranslation('common')
  const { descriptor } = useEServiceCreateContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceMutations.usePostVersionDraftDocument()
  const { jwt } = AuthHooks.useJwt()

  const defaultValues: UploadCallbackInterfaceDocFormValues = { callbackInterfaceDoc: null }
  const formMethods = useForm({ defaultValues, shouldUnregister: true })
  const selectedInterface = formMethods.watch('callbackInterfaceDoc')

  React.useEffect(() => {
    if (error) {
      formMethods.setError('callbackInterfaceDoc', { message: error })
    } else {
      formMethods.clearErrors('callbackInterfaceDoc')
    }
  }, [error, formMethods])

  const actualInterface: EServiceDoc | null = descriptor?.asyncExchangeCallbackInterface ?? null

  const onSubmit: SubmitHandler<UploadCallbackInterfaceDocFormValues> = ({
    callbackInterfaceDoc,
  }) => {
    if (!callbackInterfaceDoc || !descriptor) return

    const prettyName = t('callbackInterface.prettyName')

    uploadDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      doc: callbackInterfaceDoc,
      prettyName: `${prettyName}_${descriptor.eservice.name}_${jwt?.organization.name}_v${descriptor.version}`,
      kind: 'ASYNC_EXCHANGE_CALLBACK_INTERFACE',
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
        sx={{ mt: 2 }}
        doc={actualInterface}
        onDelete={handleDeleteInterface}
        onDownload={handleDownloadInterface}
        size="small"
      />
    )
  }

  return (
    <FormProvider {...formMethods}>
      <Box
        component="form"
        onSubmit={formMethods.handleSubmit(onSubmit)}
        sx={{ py: 2 }}
        bgcolor="common.white"
      >
        <RHFSingleFileInput
          sx={{ my: 0 }}
          name="callbackInterfaceDoc"
          rules={{ required: true }}
          data-testid="callbackFileInput"
          dropzoneLabel={t('callbackInterface.dropzoneLabel')}
        />

        {selectedInterface && (
          <Stack direction="row">
            <Button
              name="uploadCallbackInterfaceDocBtn"
              type="submit"
              variant="contained"
              startIcon={<SaveIcon fontSize="small" />}
              sx={{ mt: 2 }}
              data-testid="submitCallbackButton"
            >
              {tCommon('actions.saveDocument')}
            </Button>
          </Stack>
        )}
      </Box>
    </FormProvider>
  )
}
