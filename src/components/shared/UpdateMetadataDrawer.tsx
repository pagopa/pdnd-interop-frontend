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
  target?: string
}

export type UpdateMetadataFieldProps = {
  label: string
  helperText: string
  validation: {
    required: boolean
    minLength?: number
    maxLength?: number
  }
}

type UpdateMetadataDrawerProps = {
  isOpen: boolean
  title: string
  description: React.ReactNode
  nameField: UpdateMetadataFieldProps
  descriptionField: UpdateMetadataFieldProps
  targetField?: UpdateMetadataFieldProps
  initialValues?: UpdateMetadataFormValues
  onClose: VoidFunction
  onSubmit: (values: UpdateMetadataFormValues) => void
}

const getValidationRules = (validation: UpdateMetadataFieldProps['validation']) => ({
  ...validation,
  required: validation.required || undefined,
})

export const UpdateMetadataDrawer: React.FC<UpdateMetadataDrawerProps> = ({
  isOpen,
  title,
  description,
  nameField,
  descriptionField,
  targetField,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const { t: tCommon } = useTranslation('common')

  const defaultValues: UpdateMetadataFormValues = {
    name: initialValues?.name ?? '',
    description: initialValues?.description ?? '',
    target: initialValues?.target ?? '',
  }

  const formMethods = useForm<UpdateMetadataFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      target: initialValues?.target ?? '',
    })
  }, [initialValues?.name, initialValues?.description, initialValues?.target, formMethods])

  const handleSubmit = (values: UpdateMetadataFormValues) => {
    onSubmit({
      name: values.name,
      description: values.description,
      ...(targetField ? { target: values.target } : {}),
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
            required={nameField.validation.required}
            inputProps={{ maxLength: nameField.validation.maxLength }}
            rules={getValidationRules(nameField.validation)}
          />
          <RHFNewTextField
            name="description"
            label={descriptionField.label}
            helperText={descriptionField.helperText}
            required={descriptionField.validation.required}
            multiline
            inputProps={{ maxLength: descriptionField.validation.maxLength }}
            rules={getValidationRules(descriptionField.validation)}
          />
          {targetField && (
            <RHFNewTextField
              name="target"
              label={targetField.label}
              helperText={targetField.helperText}
              required={targetField.validation.required}
              multiline
              inputProps={{ maxLength: targetField.validation.maxLength }}
              rules={getValidationRules(targetField.validation)}
            />
          )}
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
