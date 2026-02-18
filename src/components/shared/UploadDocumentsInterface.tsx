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
}

export const UploadDocumentsInterface: React.FC<UploadDocumentsInterfaceProps> = ({
  onSubmit,
  sxBox,
  error,
}) => {
  const { t } = useTranslation('common')
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
        />

        {selectedInterface && (
          <Stack direction="row">
            <Button
              name="uploadInterfaceDocBtn"
              variant="contained"
              startIcon={<SaveIcon fontSize="small" />}
              sx={{ mt: 2 }}
              data-testid="submitButton"
              onClick={formMethods.handleSubmit(onSubmit)}
            >
              {t('actions.saveDocument')}
            </Button>
          </Stack>
        )}
      </Box>
    </FormProvider>
  )
}
