import { AttributeMutations } from '@/api/attribute'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type CreateAttributeDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

type CreateNewAttributeFormValues = {
  name: string
  description: string
}

export const CreateAttributeDrawer: React.FC<CreateAttributeDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.manageTab.drawer' })

  const { mutate: createCertifiedAttribute } = AttributeMutations.useCreateCertified()

  const formMethods = useForm<CreateNewAttributeFormValues>({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = formMethods.handleSubmit((values: CreateNewAttributeFormValues) => {
    createCertifiedAttribute(values, { onSuccess: onClose })
  })

  return (
    <FormProvider {...formMethods}>
      <Drawer
        title={t('title')}
        subtitle={t('subtitle')}
        buttonAction={{
          action: onSubmit,
          label: t('submitBtnLabel'),
        }}
        onTransitionExited={formMethods.reset}
        onClose={onClose}
        isOpen={isOpen}
      >
        <Stack component="form" noValidate spacing={3}>
          <RHFTextField
            label={t('form.nameField.label')}
            labelType="external"
            name="name"
            inputProps={{ maxLength: 160 }}
            rules={{ required: true, minLength: 5 }}
            infoLabel={t('form.nameField.infoLabel')}
          />
          <RHFTextField
            label={t('form.descriptionField.label')}
            labelType="external"
            multiline
            name="description"
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
            infoLabel={t('form.descriptionField.infoLabel')}
          />
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
