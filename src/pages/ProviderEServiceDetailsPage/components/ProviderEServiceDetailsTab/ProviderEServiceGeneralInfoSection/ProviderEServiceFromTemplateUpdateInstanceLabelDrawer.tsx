import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateInstanceLabelFormValues = {
  instanceLabel: string
}

type UpdateInstanceLabelDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  id: string
  instanceLabel: string
  onSubmit: (id: string, newName: string) => void
}

export const ProviderEServiceFromTemplateUpdateInstanceLabelDrawer: React.FC<
  UpdateInstanceLabelDrawerProps
> = ({ isOpen, onClose, id, instanceLabel, onSubmit }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateEserviceInstanceLabelDrawer',
  })

  const { t: tCommon } = useTranslation('common')

  const defaultValues = {
    instanceLabel: instanceLabel,
  }

  const formMethods = useForm<UpdateInstanceLabelFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({ instanceLabel: instanceLabel })
  }, [instanceLabel, formMethods])

  const handleSubmit = (values: UpdateInstanceLabelFormValues) => {
    onSubmit(id, values.instanceLabel)
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
            name="instanceLabel"
            label={t('eserviceInstanceLabelField.label')}
            infoLabel={t('eserviceInstanceLabelField.infoLabel')}
            type="text"
            size="small"
            inputProps={{ maxLength: 60 }}
            rules={{
              required: true,
              minLength: 5,
              validate: (value) =>
                value !== instanceLabel || t('eserviceInstanceLabelField.validation.sameValue'),
            }}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
