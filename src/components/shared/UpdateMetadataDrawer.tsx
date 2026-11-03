import { Drawer } from '@/components/shared/Drawer'
import { RHFNewTextField } from '@/components/shared/react-hook-form-inputs'
import { Stack } from '@mui/material'
import isEmpty from 'lodash/isEmpty'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export type UpdateMetadataFormValues = {
  name: string
  description: string
  audience?: string
}

export type UpdateMetadataFieldConfig = {
  label: string
  helperText: string
}

type UpdateMetadataDrawerProps = {
  isOpen: boolean
  title: string
  description: React.ReactNode
  nameField: UpdateMetadataFieldConfig
  descriptionField: UpdateMetadataFieldConfig
  isEService?: boolean
  audienceField?: UpdateMetadataFieldConfig
  initialValues?: UpdateMetadataFormValues
  onClose: VoidFunction
  onSubmit: (values: UpdateMetadataFormValues) => void
}

export const UpdateMetadataDrawer: React.FC<UpdateMetadataDrawerProps> = ({
  isOpen,
  title,
  description,
  nameField,
  descriptionField,
  isEService,
  audienceField,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const { t: tCommon } = useTranslation('common')

  const maxDescriptionLength = isEService ? 400 : 250

  const defaultValues: UpdateMetadataFormValues = {
    name: initialValues?.name ?? '',
    description: initialValues?.description ?? '',
    audience: initialValues?.audience ?? '',
  }

  const formMethods = useForm<UpdateMetadataFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      audience: initialValues?.audience ?? '',
    })
  }, [initialValues?.name, initialValues?.description, initialValues?.audience, formMethods])

  const handleSubmit = (values: UpdateMetadataFormValues) => {
    onSubmit({
      name: values.name,
      description: values.description,
      ...(audienceField ? { audience: values.audience } : {}),
    })
  }

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        onTransitionExited={handleTransitionExited}
        title={title}
        subtitle={description}
        buttonAction={{
          action: formMethods.handleSubmit(handleSubmit),
          label: tCommon('actions.saveEdits'),
          color: isEmpty(formMethods.formState.errors) ? 'primary' : 'error',
        }}
      >
        <Stack component="form" noValidate spacing={6} onSubmit={(event) => event.preventDefault()}>
          <RHFNewTextField
            name="name"
            label={nameField.label}
            helperText={nameField.helperText}
            focusOnMount
            required
            inputProps={{ maxLength: 60 }}
            rules={{ required: true, minLength: 5, maxLength: 60 }}
          />
          <RHFNewTextField
            name="description"
            label={descriptionField.label}
            helperText={descriptionField.helperText}
            required
            multiline
            inputProps={{ maxLength: maxDescriptionLength }}
            rules={{ required: true, minLength: 10, maxLength: maxDescriptionLength }}
          />
          {audienceField && (
            <RHFNewTextField
              name="audience"
              label={audienceField.label}
              helperText={audienceField.helperText}
              required
              multiline
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10, maxLength: 250 }}
            />
          )}
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
