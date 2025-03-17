import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack, Box, Typography, Tooltip, Button } from '@mui/material'
import { emailRegex } from '@/utils/form.utils'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import type { UseFieldArrayReturn } from 'react-hook-form'
import type {
  TemplateInstanceInterfaceMetadata,
  EServiceDoc,
  EServiceTechnology,
} from '@/api/api.generatedTypes'
import { TemplateDownloads } from '@/api/template/template.downloads'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { ExtendedTemplateInstanceInterfaceMetadata } from './EServiceCreateFromTemplateStepDocuments'

type EServiceEditInfoInterfaceProps = {
  fieldsArray: UseFieldArrayReturn<ExtendedTemplateInstanceInterfaceMetadata, 'serverUrls', 'id'>
  eServiceTechnology: EServiceTechnology
}

export const EServiceEditInfoInterface: React.FC<EServiceEditInfoInterfaceProps> = ({
  fieldsArray,
  eServiceTechnology,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { descriptor } = useEServiceCreateContext()

  const downloadDocument = TemplateDownloads.useDownloadVersionDocument()

  const handleDownloadInterfaceDocument = () => {
    if (descriptor?.templateRef?.templateId && descriptor?.templateRef?.templateInterfaceId)
      downloadDocument(
        {
          eServiceTemplateId: descriptor?.templateRef?.templateId,
          eServiceTemplateVersionId: descriptor?.templateRef?.templateVersionId as string,
          documentId: descriptor?.templateRef?.templateInterfaceId,
        },
        getDownloadDocumentName(descriptor.interface as EServiceDoc)
      )
  }

  return (
    <Box component="div" bgcolor="common.white">
      <Stack alignItems="start" mb={2}>
        <Button
          variant="naked"
          sx={{ fontWeight: 600 }}
          onClick={handleDownloadInterfaceDocument}
          endIcon={<DownloadIcon sx={{ ml: 1 }} fontSize="small" />}
        >
          {t('step4.template.interface.description.download')}
        </Button>
      </Stack>

      {eServiceTechnology === 'REST' && <EditRESTInfoIntefaceFields />}

      <Stack direction="column">
        <RHFTextField
          size="small"
          sx={{ width: '50%' }}
          name={`serverUrls`}
          indexFieldArray={0}
          fieldArrayKeyName="url"
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

        <Button
          size="small"
          variant="naked"
          sx={{ my: 1, fontWeight: 800, alignSelf: 'start', fontSize: '1rem' }}
          onClick={() => fieldsArray.append({ url: '' })}
          startIcon={<AddIcon fontSize="small" />}
        >
          {t('step4.template.interface.serverSection.add')}
        </Button>
      </Stack>
    </Box>
  )
}

export const EditRESTInfoIntefaceFields: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { t: tCommon } = useTranslation('common')

  return (
    <>
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
          name="contactEmail"
          label={t('step4.template.interface.contactSection.emailField')}
          rules={{
            required: false,
            pattern: {
              value: emailRegex,
              message: tCommon('validation.string.email'),
            },
          }}
        />
        <RHFTextField
          size="small"
          sx={{ flex: '0 0 50%' }}
          name="contactUrl"
          label={t('step4.template.interface.contactSection.urlField')}
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
        rules={{ required: false }}
      />
      <Typography variant="body2" fontWeight={600}>
        {t('step4.template.interface.serverSection.title')}
      </Typography>
    </>
  )
}

export const UrlInputField: React.FC<{
  index: number
  id: string
  remove: UseFieldArrayReturn<TemplateInstanceInterfaceMetadata, never, 'id'>['remove']
}> = ({ index, id, remove }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })

  return (
    <Stack direction="row" alignItems="center" key={id}>
      {index >= 1 && (
        <Tooltip title={t('step4.template.interface.serverSection.remove')}>
          <Button color="error" sx={{ p: 1 }} onClick={() => remove(index)} variant="naked">
            <RemoveCircleOutlineIcon fontSize="small" />
          </Button>
        </Tooltip>
      )}
      <RHFTextField
        size="small"
        sx={{ width: '50%' }}
        name={`serverUrls`}
        indexFieldArray={index}
        fieldArrayKeyName="url"
        label={t('step4.template.interface.serverSection.label')}
      />
    </Stack>
  )
}
