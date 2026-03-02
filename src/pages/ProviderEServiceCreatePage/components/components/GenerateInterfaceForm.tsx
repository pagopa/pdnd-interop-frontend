import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack, Box, Typography, Tooltip, Button } from '@mui/material'
import { emailRegex, urlRegex } from '@/utils/form.utils'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { useForm, FormProvider, type UseFieldArrayReturn, useFieldArray } from 'react-hook-form'
import type {
  TemplateInstanceInterfaceMetadata,
  TemplateInstanceInterfaceRESTSeed,
  TemplateInstanceInterfaceSOAPSeed,
} from '@/api/api.generatedTypes'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { EServiceMutations } from '@/api/eservice'
import SaveIcon from '@mui/icons-material/Save'

export interface ExtendedTemplateInstanceInterfaceMetadata
  extends Omit<TemplateInstanceInterfaceMetadata, 'serverUrls'> {
  serverUrls: { url: string }[]
}

export const GenerateInterfaceForm: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step4.eserviceTemplate.interface' })
  const { descriptor } = useEServiceCreateContext()

  const downloadDocument = EServiceTemplateDownloads.useDownloadVersionDocument()

  const handleDownloadInterfaceDocument = () => {
    if (
      descriptor?.templateRef?.templateId &&
      descriptor?.templateRef &&
      descriptor.templateRef.templateInterface
    ) {
      downloadDocument(
        {
          eServiceTemplateId: descriptor?.templateRef?.templateId,
          eServiceTemplateVersionId: descriptor?.templateRef?.templateVersionId as string,
          documentId: descriptor?.templateRef?.templateInterface?.id,
        },
        getDownloadDocumentName(descriptor?.templateRef?.templateInterface)
      )
    }
  }

  const eServiceTechnology = descriptor?.eservice.technology

  const defaultValues: ExtendedTemplateInstanceInterfaceMetadata = {
    contactName: descriptor?.templateRef?.interfaceMetadata?.contactName ?? '',
    contactEmail: descriptor?.templateRef?.interfaceMetadata?.contactEmail ?? '',
    contactUrl: descriptor?.templateRef?.interfaceMetadata?.contactUrl ?? '',
    termsAndConditionsUrl: descriptor?.templateRef?.interfaceMetadata?.termsAndConditionsUrl ?? '',
    serverUrls: descriptor?.serverUrls?.map((url) => ({ url })) ?? [{ url: '' }],
  }

  const { mutate: deleteAndUpdateEServiceRESTInterfaceInfo } =
    EServiceMutations.useDeleteAndUpdateEServiceInterfaceRESTInfo()
  const { mutate: deleteAndupdateEServiceSOAPInterfaceInfo } =
    EServiceMutations.useDeleteAndUpdateEServiceInterfaceSOAPInfo()

  const formMethods = useForm({ defaultValues })

  const fieldsArray = useFieldArray({
    control: formMethods.control,
    name: 'serverUrls',
  })

  const onSubmit = async (values: ExtendedTemplateInstanceInterfaceMetadata) => {
    if (!descriptor) return

    const mapServerUrls = (
      serverUrls: ExtendedTemplateInstanceInterfaceMetadata['serverUrls']
    ): string[] => {
      return serverUrls.map((serverUrl) => serverUrl.url)
    }

    if (descriptor.eservice.technology === 'REST') {
      onRestApiSubmit(
        values,
        mapServerUrls(values.serverUrls),
        descriptor?.eservice.id,
        descriptor?.id
      )
    } else {
      onSoapApiSubmit(mapServerUrls(values.serverUrls), descriptor?.eservice.id, descriptor?.id)
    }
  }

  const onRestApiSubmit = (
    values: ExtendedTemplateInstanceInterfaceMetadata,
    serverUrls: string[],
    eserviceId: string,
    descriptorId: string
  ) => {
    const payload: TemplateInstanceInterfaceRESTSeed = {
      contactName: values?.contactName as string,
      contactEmail: values.contactEmail as string,
      ...(values.contactUrl && { contactUrl: values.contactUrl }),
      ...(values.termsAndConditionsUrl && { termsAndConditionsUrl: values.termsAndConditionsUrl }),
      serverUrls,
    }
    deleteAndUpdateEServiceRESTInterfaceInfo({
      ...payload,
      eserviceId,
      descriptorId,
      documentId: descriptor?.interface?.id,
    })
  }

  const onSoapApiSubmit = (serverUrls: string[], eserviceId: string, descriptorId: string) => {
    const payload: TemplateInstanceInterfaceSOAPSeed = {
      serverUrls,
    }
    deleteAndupdateEServiceSOAPInterfaceInfo({
      ...payload,
      eserviceId,
      descriptorId,
      documentId: descriptor?.interface?.id,
    })
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" bgcolor="common.white" onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack alignItems="start" mb={2}>
          <Button
            variant="naked"
            sx={{ fontWeight: 600 }}
            onClick={handleDownloadInterfaceDocument}
            endIcon={<DownloadIcon sx={{ ml: 1 }} fontSize="small" />}
          >
            {t('description.download')}
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
            label={t('serverSection.label')}
            rules={{
              required: true,
            }}
          />
          {fieldsArray.fields.slice(1).map((item, index) => {
            // Starting from 1 because first field is already rendered and need to be rendered always.
            return (
              <UrlInputField
                key={index}
                id={item.id}
                index={index + 1}
                remove={fieldsArray.remove}
              />
            )
          })}

          <Button
            size="small"
            variant="naked"
            sx={{ my: 1, fontWeight: 800, alignSelf: 'start', fontSize: '1rem' }}
            onClick={() => fieldsArray.append({ url: '' })}
            startIcon={<AddIcon fontSize="small" />}
          >
            {t('serverSection.add')}
          </Button>
        </Stack>

        <Stack direction="row" justifyContent="flex-start" mt={2}>
          <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
            {t('save')}
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  )
}

export const EditRESTInfoIntefaceFields: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step4.eserviceTemplate.interface' })
  const { t: tCommon } = useTranslation('common')

  return (
    <>
      <Typography variant="body2" fontWeight={600}>
        {t('contactSection.title')}
      </Typography>
      <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
        <RHFTextField
          size="small"
          sx={{ flex: '1 1 50%' }}
          name="contactName"
          label={t('contactSection.contactNameField')}
          rules={{ required: true }}
        />
        <RHFTextField
          size="small"
          sx={{ flex: '1 1 50%', pl: 1 }}
          name="contactEmail"
          label={t('contactSection.emailField')}
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
          label={t('contactSection.urlField')}
          rules={{
            required: undefined,
            pattern: {
              value: urlRegex,
              message: tCommon('validation.string.url'),
            },
          }}
        />
      </Stack>
      <Typography variant="body2" fontWeight={600}>
        {t('termsAndConditions.title')}
      </Typography>
      <RHFTextField
        size="small"
        sx={{ width: '50%' }}
        name="termsAndConditionsUrl"
        label={t('termsAndConditions.label')}
        rules={{
          required: undefined,
          pattern: {
            value: urlRegex,
            message: tCommon('validation.string.url'),
          },
        }}
      />
      <Typography variant="body2" fontWeight={600}>
        {t('serverSection.title')}
      </Typography>
    </>
  )
}

export const UrlInputField: React.FC<{
  index: number
  id: string
  remove: UseFieldArrayReturn<TemplateInstanceInterfaceMetadata, never, 'id'>['remove']
}> = ({ index, id, remove }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step4.eserviceTemplate.interface' })

  return (
    <Stack direction="row" alignItems="center" key={id}>
      {index >= 1 && (
        <Tooltip title={t('serverSection.remove')}>
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
        label={t('serverSection.label')}
      />
    </Stack>
  )
}
