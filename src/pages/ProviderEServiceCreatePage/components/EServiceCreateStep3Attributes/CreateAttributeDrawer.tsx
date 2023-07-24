import type { AttributeKind } from '@/api/api.generatedTypes'
import { AttributeMutations } from '@/api/attribute'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import type { AttributeKey } from '@/types/attribute.types'
import { Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

type CreateAttributeDrawerProps = {
  attributeKey: AttributeKey
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
  const { mutate: createAttribute } = AttributeMutations.useCreate()

  const formMethods = useForm<CreateNewAttributeFormValues>({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const handleClose = () => {
    formMethods.reset()
    onClose()
  }

  const onSubmit = formMethods.handleSubmit((values: CreateNewAttributeFormValues) => {
    createAttribute(
      { ...values, kind: attributeKey.toUpperCase() as AttributeKind },
      { onSuccess: handleClose }
    )
  })

  return (
    <FormProvider {...formMethods}>
      <Drawer
        title="Crea nuovo attributo verificato"
        subtitle="Una volta creato, troverai l’attributo nella lista tra quelli disponibili per essere aggiunti ad un e-service"
        // Check ddsadasdkas
        buttonAction={{
          action: onSubmit,
          label: 'Crea attributo',
        }}
        onClose={handleClose}
        {...props}
      >
        <Stack component="form" noValidate spacing={2}>
          <RHFTextField
            label="Nome dell'attributo"
            name="name"
            inputProps={{ maxLength: 160 }}
            rules={{ required: true, minLength: 5 }}
          />
          <RHFTextField
            label="Descrizione dell’attributo"
            multiline
            name="description"
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
          />
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
