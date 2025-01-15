import type { ProducerDescriptorEService } from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateEServiceNameFormValues = {
  eserviceName: string
}

type ProviderEServiceUpdateNameDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  eservice: ProducerDescriptorEService
}

export const ProviderEServiceUpdateNameDrawer: React.FC<ProviderEServiceUpdateNameDrawerProps> = ({
  isOpen,
  onClose,
  eservice,
}) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateEServiceNameDrawer',
  })
  const { t: tCommon } = useTranslation('common')

  const { mutate: updateEserviceName } = EServiceMutations.useUpdateEServiceName()

  const defaultValues = {
    eserviceName: eservice.name,
  }

  const formMethods = useForm<UpdateEServiceNameFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({ eserviceName: eservice.name })
  }, [eservice.name, formMethods])

  const onSubmit = (values: UpdateEServiceNameFormValues) => {
    updateEserviceName(
      {
        eserviceId: eservice.id,
        name: values.eserviceName,
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
            name="eserviceName"
            label={t('eserviceNameField.label')}
            type="text"
            size="small"
            rows={10}
            inputProps={{ maxLength: 250 }}
            rules={{
              required: true,
              minLength: 10,
              maxLength: 250,
              validate: (value) =>
                value !== eservice.name || t('eserviceNameField.validation.sameValue'),
            }}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
