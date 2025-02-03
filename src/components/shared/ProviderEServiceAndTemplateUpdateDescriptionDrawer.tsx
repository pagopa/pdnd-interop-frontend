import type { ProducerDescriptorEService } from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { TemplateMutations } from '@/api/template'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateDescriptionFormValues = {
  eserviceDescription: string
}

type ProviderEServiceAndTemplateUpdateDescriptionDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  eservice?: ProducerDescriptorEService
  template?: //ProducerEServiceTemplate TODO
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
    eserviceDescription: string
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
} & (
  | {
      eservice: ProducerDescriptorEService
      template?: never
    }
  | {
      template: {
        //TODO
        id: string
        name: string
        versions: {
          id: string
          version: string
          description: string
          state: string
          voucherLifespan: number
          dailyCallsPerConsumer: number
          dailyCallsTotal: number
        }[]
        state: string
        eserviceDescription: string
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
      eservice?: never
    }
)

export const ProviderEServiceAndTemplateUpdateDescriptionDrawer: React.FC<
  ProviderEServiceAndTemplateUpdateDescriptionDrawerProps
> = ({ isOpen, onClose, eservice, template }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateEServiceDescriptionDrawer',
  })
  const { t: tCommon } = useTranslation('common')

  const { mutate: updateEserviceDescription } = EServiceMutations.useUpdateEServiceDescription()
  const { mutate: updateTemplateEserviceDescription } =
    TemplateMutations.useUpdateTemplateEServiceDescription()

  const defaultValues = {
    eserviceDescription: eservice ? eservice.description : template.eserviceDescription,
  }

  const formMethods = useForm<UpdateDescriptionFormValues>({ defaultValues })

  const oldDescription = eservice ? eservice.description : template?.eserviceDescription

  React.useEffect(() => {
    if (eservice) {
      formMethods.reset({ eserviceDescription: eservice.description })
    }
    if (template) {
      formMethods.reset({ eserviceDescription: template.eserviceDescription })
    }
  }, [eservice && eservice.description, template && template.eserviceDescription, formMethods])

  const onSubmit = (values: UpdateDescriptionFormValues) => {
    if (eservice) {
      updateEserviceDescription(
        {
          eserviceId: eservice.id,
          description: values.eserviceDescription,
        },
        { onSuccess: onClose }
      )
    }
    if (template) {
      updateTemplateEserviceDescription(
        {
          eserviceTemplateId: template.id,
          description: values.eserviceDescription,
        },
        { onSuccess: onClose }
      )
    }
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
            name="eserviceDescription"
            label={t('eserviceDescriptionField.label')}
            infoLabel={t('eserviceDescriptionField.infoLabel')}
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
                value !== oldDescription || t('eserviceDescriptionField.validation.sameValue'),
            }}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
