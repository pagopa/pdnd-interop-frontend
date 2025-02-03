import { TemplateMutations } from '@/api/template'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateEServiceTemplateAudienceFormValues = {
  templateAudience: string
}

type ProviderEServiceUpdateAudienceDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  template: //ProducerEServiceTemplate TODO
  {
    id: string
    name: string
    versions: [
      {
        id: string
        version: string
        description: string
        state: string
        voucherLifespan: number
        dailyCallsPerConsumer: number
        dailyCallsTotal: number
        //attributes: EServiceAttributes,
      },
    ]
    state: string
    templateDescription: string
    audienceDescription: string
    creatorId: string
    technology: string
    mode: string
    isSignalHubEnabled: boolean
    attributes: [
      {
        certified: ['']
        verified: ['']
        declared: ['']
      },
    ]
  }
}

export const ProviderEServiceTemplateUpdateAudienceDrawer: React.FC<
  ProviderEServiceUpdateAudienceDrawerProps
> = ({ isOpen, onClose, template }) => {
  const { t } = useTranslation('template', {
    keyPrefix: 'read.drawers.updateEServiceTemplateAudienceDrawer',
  })
  const { t: tCommon } = useTranslation('common')

  const { mutate: updateEserviceTemplateAudience } =
    TemplateMutations.useUpdateEServiceTemplateAudience()

  const defaultValues = {
    templateAudience: template.audienceDescription,
  }

  const formMethods = useForm<UpdateEServiceTemplateAudienceFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({ templateAudience: template.audienceDescription })
  }, [template.audienceDescription, formMethods])

  const onSubmit = (values: UpdateEServiceTemplateAudienceFormValues) => {
    updateEserviceTemplateAudience(
      {
        templateId: template.id,
        Audience: values.templateAudience,
      },
      { onSuccess: onClose }
    )
  }

  const handleCloseDrawer = () => {
    onClose()
  }

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onTransitionExited={handleTransitionExited}
        onClose={handleCloseDrawer}
        title={t('title')}
        subtitle={t('subtitle')}
        buttonAction={{
          action: formMethods.handleSubmit(onSubmit),
          label: tCommon('actions.upgrade'),
        }}
      >
        <Box component="form" noValidate>
          <RHFTextField
            sx={{ mt: 2, mb: 2 }}
            focusOnMount
            name="templateAudience"
            label={t('templateAudienceField.label')}
            infoLabel={t('templateAudienceField.infoLabel')}
            type="text"
            multiline
            size="small"
            rows={10}
            inputProps={{ maxLength: 250 }}
            rules={{
              required: true,
              minLength: 10,
              maxLength: 250,
              validate: (value) =>
                value !== template.audienceDescription ||
                t('templateAudienceField.validation.sameValue'),
            }}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
