import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateDescriptionFormValues = {
  eserviceDescription: string
}

type UpdateDescriptionDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  id: string
  description: string
  title: string
  subtitle: string
  label: string
  infoLabel: string
  validateLabel: string
  onSubmit: (id: string, newDescription: string) => void
}

export const UpdateDescriptionDrawer: React.FC<UpdateDescriptionDrawerProps> = ({
  isOpen,
  onClose,
  id,
  description,
  title,
  subtitle,
  label,
  infoLabel,
  validateLabel,
  onSubmit,
}) => {
  const { t: tCommon } = useTranslation('common')

  const defaultValues = {
    eserviceDescription: description,
  }

  const formMethods = useForm<UpdateDescriptionFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({ eserviceDescription: description })
  }, [description, formMethods])

  const handleSubmit = (values: UpdateDescriptionFormValues) => {
    onSubmit(id, values.eserviceDescription)
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
        title={title}
        subtitle={subtitle}
        buttonAction={{
          action: formMethods.handleSubmit(handleSubmit),
          label: tCommon('actions.upgrade'),
        }}
      >
        <Box component="form" noValidate>
          <RHFTextField
            sx={{ mt: 2, mb: 2 }}
            focusOnMount
            name="eserviceDescription"
            label={label}
            infoLabel={infoLabel}
            type="text"
            multiline
            size="small"
            rows={10}
            inputProps={{ maxLength: 250 }}
            rules={{
              required: true,
              minLength: 10,
              maxLength: 250,
              validate: (value) => value !== description || validateLabel,
            }}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
