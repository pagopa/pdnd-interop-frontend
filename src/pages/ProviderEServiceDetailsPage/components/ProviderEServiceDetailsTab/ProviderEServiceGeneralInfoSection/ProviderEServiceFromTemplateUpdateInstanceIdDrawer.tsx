import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateInstanceIdFormValues = {
  instanceId: string
}

type UpdateInstanceIdDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  id: string
  instanceId: string
  onSubmit: (id: string, newName: string) => void
}

export const ProviderEServiceFromTemplateUpdateInstanceIdDrawer: React.FC<
  UpdateInstanceIdDrawerProps
> = ({ isOpen, onClose, id, instanceId, onSubmit }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateEserviceInstanceIdDrawer',
  })

  const { t: tCommon } = useTranslation('common')

  const defaultValues = {
    instanceId: instanceId,
  }

  const formMethods = useForm<UpdateInstanceIdFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({ instanceId: instanceId })
  }, [instanceId, formMethods])

  const handleSubmit = (values: UpdateInstanceIdFormValues) => {
    onSubmit(id, values.instanceId)
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
          action: formMethods.handleSubmit(handleSubmit),
          label: tCommon('actions.upgrade'),
        }}
      >
        <Box component="form" noValidate>
          <RHFTextField
            sx={{ mt: 2, mb: 2 }}
            focusOnMount
            name="instanceId"
            label={t('eserviceInstanceIdField.label')}
            infoLabel={t('eserviceInstanceIdField.infoLabel')}
            type="text"
            size="small"
            inputProps={{ maxLength: 60 }}
            rules={{
              required: true,
              minLength: 5,
              validate: (value) =>
                value !== instanceId || t('eserviceInstanceIdField.validation.sameValue'),
            }}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
