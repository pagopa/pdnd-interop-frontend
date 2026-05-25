import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput } from './react-hook-form-inputs'
import type { SxProps, Theme } from '@mui/material'
import { Box, Button, Stack } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { useTranslation } from 'react-i18next'

type UploadDocumentsInterfaceFormValues = {
  interfaceDoc: File | null
}

type UploadDocumentsInterfaceProps = {
  onSubmit: ({ interfaceDoc }: UploadDocumentsInterfaceFormValues) => void
  sxBox?: SxProps<Theme>
  error?: string
  dropzoneLabel?: string
}

export const UploadDocumentsInterface: React.FC<UploadDocumentsInterfaceProps> = ({
  onSubmit,
  sxBox,
  error,
  dropzoneLabel,
}) => {
  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common')
  const defaultValues: UploadDocumentsInterfaceFormValues = {
    interfaceDoc: null,
  }

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  })
  const selectedInterface = formMethods.watch('interfaceDoc')

  React.useEffect(() => {
    if (error) {
      formMethods.setError('interfaceDoc', { message: error })
    } else {
      formMethods.clearErrors('interfaceDoc')
    }
  }, [error, formMethods])

  return (
    <FormProvider {...formMethods}>
      <Box sx={sxBox} bgcolor="common.white">
        <RHFSingleFileInput
          sx={{ my: 0 }}
          name="interfaceDoc"
          rules={{ required: true }}
          data-testid="fileInput"
          dropzoneLabel={dropzoneLabel ?? t('create.step4.interface.dropzoneLabel')}
        />

        {selectedInterface && (
          <Stack direction="row">
            <Button
              name="uploadInterfaceDocBtn"
              type="button"
              onClick={formMethods.handleSubmit(onSubmit)}
              variant="contained"
              startIcon={<SaveIcon fontSize="small" />}
              sx={{ mt: 2 }}
              data-testid="submitButton"
            >
              {tCommon('actions.saveDocument')}
            </Button>
          </Stack>
        )}
      </Box>
    </FormProvider>
  )
}
