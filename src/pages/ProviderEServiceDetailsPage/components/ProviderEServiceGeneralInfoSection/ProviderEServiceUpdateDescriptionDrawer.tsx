import type { ProducerDescriptorEService } from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateEServiceDescriptionFormValues = {
  eserviceDescription: string
}

type ProviderEServiceUpdateDescriptionDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  eservice: ProducerDescriptorEService
}

export const ProviderEServiceUpdateDescriptionDrawer: React.FC<
  ProviderEServiceUpdateDescriptionDrawerProps
> = ({ isOpen, onClose, eservice }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateEServiceDescriptionDrawer',
  })
  const { t: tCommon } = useTranslation('common')

  const { mutate: updateEserviceDescription } = EServiceMutations.useUpdateEServiceDescription()

  const defaultValues = {
    eserviceDescription: eservice.description,
  }

  const formMethods = useForm<UpdateEServiceDescriptionFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({ eserviceDescription: eservice.description })
  }, [eservice.description, formMethods])

  const onSubmit = (values: UpdateEServiceDescriptionFormValues) => {
    updateEserviceDescription(
      {
        eserviceId: eservice.id,
        description: values.eserviceDescription,
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
                value !== eservice.description ||
                t('eserviceDescriptionField.validation.sameValue'),
            }}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
