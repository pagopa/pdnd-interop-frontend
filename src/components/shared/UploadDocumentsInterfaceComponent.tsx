import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput } from './react-hook-form-inputs'
import { Box, Button, Stack } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useTranslation } from 'react-i18next'

type CreateStepDocumentsInterfaceFormValues = {
  interfaceDoc: File | null
}

type UploadDocumentsInterfaceComponentProps = {
  onSubmit: ({ interfaceDoc }: CreateStepDocumentsInterfaceFormValues) => void
  sxBox?: object
}

export const UploadDocumentsInterfaceComponent: React.FC<
  UploadDocumentsInterfaceComponentProps
> = ({ onSubmit, sxBox }) => {
  const { t } = useTranslation('common')
  const defaultValues: CreateStepDocumentsInterfaceFormValues = {
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
        <RHFSingleFileInput sx={{ my: 0 }} name="interfaceDoc" rules={{ required: true }} />

        {selectedInterface && (
          <Stack direction="row" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              startIcon={<UploadFileIcon fontSize="small" />}
              sx={{ mt: 2 }}
            >
              {t('actions.upload')}
            </Button>
          </Stack>
        )}
      </Box>
    </FormProvider>
  )
}
