import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput } from './react-hook-form-inputs'
import type { SxProps, Theme } from '@mui/material'
import { Box, Button, Stack } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useTranslation } from 'react-i18next'

type UploadDocumentsInterfaceFormValues = {
  interfaceDoc: File | null
}

type UploadDocumentsInterfaceProps = {
  onSubmit: ({ interfaceDoc }: UploadDocumentsInterfaceFormValues) => void
  sxBox?: SxProps<Theme>
}

export const UploadDocumentsInterface: React.FC<UploadDocumentsInterfaceProps> = ({
  onSubmit,
  sxBox,
}) => {
  const { t } = useTranslation('eservice')
  const defaultValues: UploadDocumentsInterfaceFormValues = {
    interfaceDoc: null,
  }

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  })
  const selectedInterface = formMethods.watch('interfaceDoc')
  return (
    <FormProvider {...formMethods}>
      <Box
        component="form"
        noValidate
        onSubmit={formMethods.handleSubmit(onSubmit)}
        sx={sxBox}
        bgcolor="common.white"
      >
        <RHFSingleFileInput
          sx={{ my: 0 }}
          name="interfaceDoc"
          rules={{ required: true }}
          data-testid="fileInput"
          dropzoneLabel={t('create.step4.interface.dropzoneLabel')}
        />

        {selectedInterface && (
          <Stack direction="row">
            <Button
              name="uploadInterfaceDocBtn"
              type="submit"
              variant="contained"
              startIcon={<UploadFileIcon fontSize="small" />}
              sx={{ mt: 2 }}
              data-testid="submitButton"
            >
              {t('create.step4.uploadBtn')}
            </Button>
          </Stack>
        )}
      </Box>
    </FormProvider>
  )
}
