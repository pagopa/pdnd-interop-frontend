import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack, Box, Typography, Tooltip, Button } from '@mui/material'
import { emailRegex } from '@/utils/form.utils'
import { IconLink } from '@/components/shared/IconLink'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import type { UseFieldArrayReturn } from 'react-hook-form'
import type { CustomizedInterfaceMetadata, EServiceDoc } from '@/api/api.generatedTypes'
import { TemplateDownloads } from '@/api/template/template.downloads'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { getDownloadDocumentName } from '@/utils/eservice.utils'

type EServiceEditInfoInterfaceProps = {
  fieldsArray: UseFieldArrayReturn<CustomizedInterfaceMetadata, never, 'id'>
}

export const EServiceEditInfoInterface: React.FC<EServiceEditInfoInterfaceProps> = ({
  fieldsArray,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { t: tCommon } = useTranslation('common')
  const { descriptor } = useEServiceCreateContext()

  const downloadDocument = TemplateDownloads.useDownloadVersionDocument()

  const handleDownloadInterfaceDocument = () => {
    if (descriptor?.templateRef?.templateId && descriptor?.templateRef?.templateInterfaceId)
      downloadDocument(
        {
          templateId: descriptor?.templateRef?.templateId,
          documentId: descriptor?.templateRef?.templateInterfaceId,
        },
        getDownloadDocumentName(descriptor.interface as EServiceDoc)
      )
  }

  return (
    <Box component="div" bgcolor="common.white">
      <Stack alignItems="start" mb={2}>
        <IconLink
          fontWeight={600}
          key="test"
          component="button"
          type="button"
          onClick={handleDownloadInterfaceDocument}
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
          name="name"
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
        name="termsAndConditionsUrl"
        label={t('step4.template.interface.termsAndConditions.label')}
        rules={{ required: true }}
      />
      <Typography variant="body2" fontWeight={600}>
        {t('step4.template.interface.serverSection.title')}
      </Typography>
      <Stack direction="column">
        <RHFTextField
          size="small"
          sx={{ width: '50%' }}
          name={`serverUrls`}
          indexFieldArray={0}
          label={t('step4.template.interface.serverSection.label')}
          rules={{
            required: true,
          }}
        />
        {fieldsArray.fields.slice(1).map((item, index) => {
          // Starting from 1 because first field is already rendered and need to be rendered always.
          return (
            <UrlInputField key={index} id={item.id} index={index + 1} remove={fieldsArray.remove} />
          )
        })}
        <IconLink
          sx={{ mt: 1 }}
          fontWeight={800}
          key="test"
          alignSelf="start"
          component="button"
          type="button"
          onClick={() => fieldsArray.append('')}
          startIcon={<AddIcon fontSize="small" />}
        >
          {t('step4.template.interface.serverSection.add')}
        </IconLink>
      </Stack>
    </Box>
  )
}

export const UrlInputField: React.FC<{
  index: number
  id: string
  remove: UseFieldArrayReturn<CustomizedInterfaceMetadata, never, 'id'>['remove']
}> = ({ index, id, remove }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })

  return (
    <Stack direction="row" alignItems="center" key={id}>
      {index >= 1 && (
        <Tooltip title={t('step4.template.interface.serverSection.remove')}>
          <Button color="error" sx={{ p: 1 }} onClick={() => remove(index - 1)} variant="naked">
            <RemoveCircleOutlineIcon fontSize="small" />
          </Button>
        </Tooltip>
      )}
      <RHFTextField
        size="small"
        sx={{ width: '50%' }}
        name={`serverUrls`}
        indexFieldArray={index}
        label={t('step4.template.interface.serverSection.label')}
      />
    </Stack>
  )
}
