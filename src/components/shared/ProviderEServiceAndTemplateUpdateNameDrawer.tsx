import type { ProducerDescriptorEService } from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { TemplateMutations } from '@/api/template'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateEServiceAndTemplateNameFormValues = {
  eserviceName?: string
  templateName?: string
} & ({ eserviceName: string } | { templateName: string })

type ProviderEServiceAndTemplateUpdateNameDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  eservice?: ProducerDescriptorEService
  template?: {
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

export const ProviderEServiceAndTemplateUpdateNameDrawer: React.FC<
  ProviderEServiceAndTemplateUpdateNameDrawerProps
> = ({ isOpen, onClose, eservice, template }) => {
  const { t: tEservice } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateEServiceNameDrawer',
  })
  const { t: tTemplate } = useTranslation('template', {
    keyPrefix: 'read.drawers.updateEServiceTemplateNameDrawer',
  })
  const { t: tCommon } = useTranslation('common')

  const { mutate: updateEserviceName } = EServiceMutations.useUpdateEServiceName()
  const { mutate: updateEserviceTemplateName } = TemplateMutations.useUpdateEServiceTemplateName()

  const defaultValues = eservice
    ? {
        eserviceName: eservice.name,
      }
    : {
        templateName: template?.name,
      }

  const formMethods = useForm<UpdateEServiceAndTemplateNameFormValues>({ defaultValues })

  React.useEffect(() => {
    if (eservice) {
      formMethods.reset({ eserviceName: eservice.name })
    }
    if (template) {
      formMethods.reset({ templateName: template.name })
    }
  }, [eservice && eservice.name, template && template.name, formMethods])

  const onSubmit = (values: UpdateEServiceAndTemplateNameFormValues) => {
    if (eservice) {
      updateEserviceName(
        {
          eserviceId: eservice.id,
          name: values.eserviceName as string,
        },
        { onSuccess: onClose }
      )
    }
    if (template) {
      updateEserviceTemplateName(
        {
          eserviceTemplateId: template.id, //TODO
          name: values.templateName as string, //TODO
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
        title={eservice ? tEservice('title') : tTemplate('title')}
        subtitle={eservice ? tEservice('subtitle') : tTemplate('subtitle')}
        buttonAction={{
          action: formMethods.handleSubmit(onSubmit),
          label: tCommon('actions.upgrade'),
        }}
      >
        <Box component="form" noValidate>
          <RHFTextField
            sx={{ mt: 2, mb: 2 }}
            focusOnMount
            name="eserviceName"
            label={
              eservice ? tEservice('eserviceNameField.label') : tTemplate('templateNameField.label')
            }
            infoLabel={
              eservice
                ? tEservice('eserviceNameField.infoLabel')
                : tTemplate('templateNameField.infoLabel')
            }
            type="text"
            size="small"
            inputProps={{ maxLength: 60 }}
            rules={{
              required: true,
              minLength: 5,
              validate: (value) =>
                eservice
                  ? value !== eservice.name || tEservice('eserviceNameField.validation.sameValue')
                  : value !== template.name || tTemplate('templateNameField.validation.sameValue'),
            }}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
