import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateNameFormValues = {
  eserviceName: string
}

type UpdateNameDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  id: string
  name: string
  title?: string
  subtitle?: string
  label?: string
  infoLabel?: string
  validateLabel?: string
  onSubmit: (id: string, newName: string) => void
}

export const UpdateNameDrawer: React.FC<UpdateNameDrawerProps> = ({
  isOpen,
  onClose,
  id,
  name,
  title,
  subtitle,
  label,
  infoLabel,
  validateLabel,
  onSubmit,
}) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateEServiceNameDrawer',
  })

  const { t: tCommon } = useTranslation('common')

  const defaultValues = {
    eserviceName: name,
  }

  const formMethods = useForm<UpdateNameFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({ eserviceName: name })
  }, [name, formMethods])

  const handleSubmit = (values: UpdateNameFormValues) => {
    onSubmit(id, values.eserviceName)
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
        title={title || t('title')}
        subtitle={subtitle || t('subtitle')}
        buttonAction={{
          action: formMethods.handleSubmit(handleSubmit),
          label: tCommon('actions.upgrade'),
        }}
      >
        <Box component="form" noValidate>
          <RHFTextField
            sx={{ mt: 2, mb: 2 }}
            focusOnMount
            name="eserviceName"
            label={label || t('eserviceNameField.label')}
            infoLabel={infoLabel || t('eserviceNameField.infoLabel')}
            type="text"
            size="small"
            inputProps={{ maxLength: 60 }}
            rules={{
              required: true,
              minLength: 5,
              validate: (value) =>
                value !== name || validateLabel || t('eserviceNameField.validation.sameValue'),
            }}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
