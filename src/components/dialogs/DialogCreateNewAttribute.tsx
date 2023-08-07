import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { DialogCreateNewAttributeProps } from '@/types/dialog.types'
import { useDialog } from '@/stores'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFTextField } from '../shared/react-hook-form-inputs'
import { AttributeMutations } from '@/api/attribute'
import type { AttributeKind } from '@/api/api.generatedTypes'

type CreateNewAttributeFormValues = {
  name: string
  description: string
  kind: AttributeKind
}

export const DialogCreateNewAttribute: React.FC<DialogCreateNewAttributeProps> = ({
  attributeKey,
}) => {
  const ariaLabelId = React.useId()
  const { t } = useTranslation('shared-components', { keyPrefix: 'dialogCreateNewAttribute' })
  const { t: tAttribute } = useTranslation('attribute')
  const { closeDialog } = useDialog()

  const { mutate: createAttribute } = AttributeMutations.useCreate()

  const defaultValues = {
    name: '',
    description: '',
    kind: attributeKey.toUpperCase() as AttributeKind,
  }

  const formMethods = useForm<CreateNewAttributeFormValues>({
    defaultValues,
  })

  const onSubmit = (values: CreateNewAttributeFormValues) => {
    createAttribute(values, { onSuccess: closeDialog })
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId}>
            {t('title')} {tAttribute(`type.${attributeKey}`, { count: 1 })}
          </DialogTitle>

          <DialogContent>
            <RHFTextField
              focusOnMount
              name="name"
              label={t('content.nameField.label')}
              infoLabel={t('content.nameField.infoLabel')}
              inputProps={{ maxLength: 160 }}
              rules={{ required: true, minLength: 5 }}
            />
            <RHFTextField
              name="description"
              label={t('content.descriptionField.label')}
              infoLabel={t('content.descriptionField.infoLabel')}
              multiline
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10 }}
            />
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {t('actions.cancelLabel')}
            </Button>
            <Button variant="contained" type="submit">
              {t('actions.confirmLabel')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
