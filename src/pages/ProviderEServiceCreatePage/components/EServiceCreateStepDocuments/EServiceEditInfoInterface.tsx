import React from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useTranslation } from 'react-i18next'
import { Stack, Box, Button, Typography } from '@mui/material'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { EServiceDownloads, EServiceMutations } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { emailRegex } from '@/utils/form.utils'
import { IconLink } from '@/components/shared/IconLink'
import DownloadIcon from '@mui/icons-material/Download'

type EServiceEditInfoInterfaceValues = {
  interfaceDoc: File | null
  prettyName: string
}

export function EServiceEditInfoInterface() {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { t: tCommon } = useTranslation('common')

  const { descriptor } = useEServiceCreateContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceMutations.usePostVersionDraftDocument()

  const defaultValues: EServiceEditInfoInterfaceValues = {
    interfaceDoc: null,
    prettyName: t('create.step4.interface.prettyName'),
  }

  const actualInterface: EServiceDoc | null = descriptor?.interface ?? null

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  })

  const onSubmit = ({}: EServiceEditInfoInterfaceValues) => {
    alert('Edit fields')
  }

  return (
    <FormProvider {...formMethods}>
      <Box
        component="form"
        noValidate
        onSubmit={formMethods.handleSubmit(onSubmit)}
        bgcolor="common.white"
      >
        <Stack alignItems="start" mb={2}>
          <IconLink
            fontWeight={600}
            key="test"
            component="button"
            onClick={() => alert('download')}
            endIcon={<DownloadIcon sx={{ ml: 1 }} fontSize="small" />}
          >
            {t('step4.template.interface.description.download')}
          </IconLink>
        </Stack>

        <Typography variant="body2" fontWeight={600}>
          {t('step4.template.interface.contactSection.title')}
        </Typography>
        <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
          <RHFTextField
            size="small"
            sx={{ flex: '1 1 50%' }}
            name="contactName"
            label={t('step4.template.interface.contactSection.contactNameField')}
            rules={{ required: true }}
          />
          <RHFTextField
            size="small"
            sx={{ flex: '1 1 50%', pl: 1 }}
            name="email"
            label={t('step4.template.interface.contactSection.emailField')}
            rules={{
              required: true,
              pattern: {
                value: emailRegex,
                message: tCommon('validation.string.email'),
              },
            }}
          />
          <RHFTextField
            size="small"
            sx={{ flex: '0 0 50%' }}
            name="url"
            label={t('step4.template.interface.contactSection.urlField')}
            rules={{ required: true }}
          />
        </Stack>
        <Typography variant="body2" fontWeight={600}>
          {t('step4.template.interface.termsAndConditions.title')}
        </Typography>
        <RHFTextField
          size="small"
          sx={{ width: '50%' }}
          name="termsAndConditionsLink"
          label={t('step4.template.interface.termsAndConditions.label')}
          rules={{ required: true }}
        />
        <Typography variant="body2" fontWeight={600}>
          {t('step4.template.interface.serverSection.title')}
        </Typography>
        <RHFTextField
          size="small"
          sx={{ width: '50%' }}
          name="serverUrl"
          label={t('step4.template.interface.serverSection.label')}
          rules={{ required: true }}
        />
      </Box>
    </FormProvider>
  )
}
