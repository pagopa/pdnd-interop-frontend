import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack, Box, Typography, Button, Divider } from '@mui/material'
import { emailRegex, urlRegex } from '@/utils/form.utils'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useForm, FormProvider, type UseFieldArrayReturn, useFieldArray } from 'react-hook-form'
import type {
  TemplateInstanceInterfaceMetadata,
  TemplateInstanceInterfaceRESTSeed,
  TemplateInstanceInterfaceServerUrlSeed,
  TemplateInstanceInterfaceSOAPSeed,
} from '@/api/api.generatedTypes'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { EServiceMutations } from '@/api/eservice'
import SaveIcon from '@mui/icons-material/Save'

export interface ExtendedTemplateInstanceInterfaceMetadata extends Omit<
  TemplateInstanceInterfaceMetadata,
  'serverUrls'
> {
  serverUrls: { url: string; description: string }[]
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
    serverUrls:
      descriptor?.serverUrls && descriptor.serverUrls.length > 0
        ? descriptor.serverUrls.map((serverUrl) => ({
            url: serverUrl.url,
            description: serverUrl.description ?? '',
          }))
        : [{ url: '', description: '' }],
  }

  const { mutate: deleteAndUpdateEServiceRESTInterfaceInfo } =
    EServiceMutations.useDeleteAndUpdateEServiceInterfaceRESTInfo()
  const { mutate: deleteAndUpdateEServiceSOAPInterfaceInfo } =
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
    ): TemplateInstanceInterfaceServerUrlSeed[] => {
      return serverUrls.map((serverUrl) => ({
        url: serverUrl.url,
        ...(serverUrl.description && { description: serverUrl.description }),
      }))
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
    serverUrls: TemplateInstanceInterfaceServerUrlSeed[],
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

  const onSoapApiSubmit = (
    serverUrls: TemplateInstanceInterfaceServerUrlSeed[],
    eserviceId: string,
    descriptorId: string
  ) => {
    const payload: TemplateInstanceInterfaceSOAPSeed = {
      serverUrls,
    }
    deleteAndUpdateEServiceSOAPInterfaceInfo({
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

        {eServiceTechnology === 'REST' && <EditRESTInfoInterfaceFields />}

        <Stack direction="column">
          {fieldsArray.fields.map((item, index) => (
            <ServerUrlField
              key={item.id}
              index={index}
              total={fieldsArray.fields.length}
              remove={fieldsArray.remove}
            />
          ))}

          <Button
            size="small"
            variant="naked"
            sx={{ my: 1, fontWeight: 800, alignSelf: 'start', fontSize: '1rem' }}
            onClick={() => fieldsArray.append({ url: '', description: '' })}
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

export const EditRESTInfoInterfaceFields: React.FC = () => {
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
          required
          label={t('contactSection.contactNameField')}
          rules={{ required: true }}
        />
        <RHFTextField
          size="small"
          sx={{ flex: '1 1 50%', pl: 1 }}
          name="contactEmail"
          required
          label={t('contactSection.emailField')}
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
          name="contactUrl"
          label={t('contactSection.urlField')}
          rules={{
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
          pattern: {
            value: urlRegex,
            message: tCommon('validation.string.url'),
          },
        }}
      />
    </>
  )
}

const ServerUrlField: React.FC<{
  index: number
  total: number
  remove: UseFieldArrayReturn<TemplateInstanceInterfaceMetadata, never, 'id'>['remove']
}> = ({ index, total, remove }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step4.eserviceTemplate.interface' })

  const hasMultipleServers = total > 1

  return (
    <>
      {index > 0 && <Divider sx={{ my: 3 }} />}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" fontWeight={600}>
          {hasMultipleServers
            ? t('serverSection.counter', { current: index + 1, total })
            : t('serverSection.title')}
        </Typography>
        {hasMultipleServers && (
          <Button
            color="error"
            variant="naked"
            size="small"
            startIcon={<DeleteOutlineIcon fontSize="small" />}
            onClick={() => remove(index)}
          >
            {t('serverSection.removeServer')}
          </Button>
        )}
      </Stack>
      <RHFTextField
        size="small"
        sx={{ width: '50%' }}
        name={`serverUrls`}
        indexFieldArray={index}
        fieldArrayKeyName="url"
        label={t('serverSection.label')}
        required
        rules={{ required: true }}
      />
      <ServerUrlDescriptionField index={index} />
    </>
  )
}

const ServerUrlDescriptionField: React.FC<{ index: number }> = ({ index }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step4.eserviceTemplate.interface' })

  return (
    <RHFTextField
      size="small"
      name={`serverUrls`}
      indexFieldArray={index}
      fieldArrayKeyName="description"
      label={t('serverSection.descriptionLabel')}
      infoLabel={t('serverSection.descriptionInfoLabel')}
      multiline
      rows={4}
      inputProps={{ maxLength: 250 }}
      rules={{ minLength: 10 }}
    />
  )
}
