import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack, Box, Typography, Tooltip, Button } from '@mui/material'
import { emailRegex } from '@/utils/form.utils'
import { IconLink } from '@/components/shared/IconLink'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

type EServiceEditInfoInterfaceProps = {
  defaultValues: any // TO UPDATE
  fieldsArray: any // TO UPDATE
}

export const EServiceEditInfoInterface: React.FC<EServiceEditInfoInterfaceProps> = ({
  defaultValues,
  fieldsArray,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { t: tCommon } = useTranslation('common')

  return (
    <Box component="div" bgcolor="common.white">
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
      <Stack direction="column">
        {fieldsArray.fields.map((item, i) => (
          <Stack direction="row" alignItems="center" key={item.id}>
            {i > 0 && (
              <Tooltip title="Elimina">
                <Button
                  color="error"
                  sx={{ p: 1 }}
                  onClick={() => fieldsArray.remove(i)}
                  variant="naked"
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </Button>
              </Tooltip>
            )}
            <RHFTextField
              size="small"
              sx={{ width: '50%' }}
              name={`serverUrl.${i}`}
              label={t('step4.template.interface.serverSection.label')}
              rules={{ required: true }}
            />
          </Stack>
        ))}
        <IconLink
          sx={{ mt: 1 }}
          fontWeight={800}
          key="test"
          alignSelf="start"
          component="button"
          onClick={() => fieldsArray.append('')}
          startIcon={<AddIcon fontSize="small" />}
        >
          {t('step4.template.interface.serverSection.add')}
        </IconLink>
      </Stack>
    </Box>
  )
}
