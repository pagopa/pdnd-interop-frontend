import { AttributeMutations } from '@/api/attribute'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import type { AttributeKey } from '@/types/attribute.types'
import { Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type CreateAttributeDrawerProps = {
  attributeKey: Exclude<AttributeKey, 'certified'>
  isOpen: boolean
  onClose: () => void
}

type CreateNewAttributeFormValues = {
  name: string
  description: string
}

export const CreateAttributeDrawer: React.FC<CreateAttributeDrawerProps> = ({
  attributeKey,
  onClose,
  ...props
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step3.createAttributeDrawer' })

  const { mutate: createVerifiedAttribute } = AttributeMutations.useCreateVerified()
  const { mutate: createDeclaredAttribute } = AttributeMutations.useCreateDeclared()

  const formMethods = useForm<CreateNewAttributeFormValues>({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = formMethods.handleSubmit((values: CreateNewAttributeFormValues) => {
    if (attributeKey === 'verified') createVerifiedAttribute(values, { onSuccess: onClose })
    if (attributeKey === 'declared') createDeclaredAttribute(values, { onSuccess: onClose })
  })

  return (
    <FormProvider {...formMethods}>
      <Drawer
        title={t(`title.${attributeKey}`)}
        subtitle={t('subtitle')}
        buttonAction={{
          action: onSubmit,
          label: t('submitBtnLabel'),
        }}
        onTransitionExited={formMethods.reset}
        onClose={onClose}
        {...props}
      >
        <Stack component="form" noValidate spacing={3}>
          <RHFTextField
            label={t('nameField.label')}
            labelType="external"
            name="name"
            inputProps={{ maxLength: 160 }}
            rules={{ required: true, minLength: 5 }}
            infoLabel={t('nameField.infoLabel')}
          />
          <RHFTextField
            label={t('descriptionField.label')}
            labelType="external"
            multiline
            name="description"
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
            infoLabel={t('descriptionField.infoLabel')}
          />
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
