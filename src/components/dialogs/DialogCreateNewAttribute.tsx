import React from 'react'
import { Box, Button, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { DialogCreateNewAttributeProps } from '@/types/dialog.types'
import { useDialog } from '@/contexts'
import { AttributeKind } from '@/types/attribute.types'
import { mixed, object, string } from 'yup'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { TextField } from '../shared/ReactHookFormInputs'
import { AttributeMutations } from '@/api/attribute'
import { DialogContainer } from './DialogContainer'

type CreateNewAttributeFormValues = {
  name: string
  code: string
  origin: string
  description: string
  kind: AttributeKind
}

export const DialogCreateNewAttribute: React.FC<DialogCreateNewAttributeProps> = ({
  attributeKey,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'dialogCreateNewAttribute' })
  const { t: tAttribute } = useTranslation('attribute')
  const { closeDialog } = useDialog()

  const { mutate: createAttribute } = AttributeMutations.useCreate()

  const validationSchema = object({
    name: string().required(),
    code: string().required(),
    origin: string().required(),
    description: string().required(),
    kind: mixed().oneOf(['CERTIFIED', 'VERIFIED', 'DECLARED']).required(),
  })

  const defaultValues = {
    name: '',
    code: '',
    origin: '',
    description: '',
    kind: attributeKey.toUpperCase() as AttributeKind,
  }

  const formMethods = useForm<CreateNewAttributeFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  })

  const onSubmit = (values: CreateNewAttributeFormValues) => {
    createAttribute(values, { onSuccess: closeDialog })
  }

  return (
    <DialogContainer open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle>
            {t('title')} {tAttribute(`type.${attributeKey}`, { count: 1 })}
          </DialogTitle>

          <DialogContent>
            <TextField
              focusOnMount
              name="name"
              label={t('content.nameField.label')}
              infoLabel={t('content.nameField.infoLabel')}
              inputProps={{ maxLength: 160 }}
            />
            <TextField
              name="description"
              label={t('content.descriptionField.label')}
              infoLabel={t('content.descriptionField.infoLabel')}
              multiline
              inputProps={{ maxLength: 250 }}
            />
            <TextField
              name="code"
              label={t('content.codeField.label')}
              infoLabel={t('content.codeField.infoLabel')}
              inputProps={{ maxLength: 30 }}
            />
            <TextField
              name="origin"
              label={t('content.originField.label')}
              infoLabel={t('content.originField.infoLabel')}
              inputProps={{ maxLength: 64 }}
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
    </DialogContainer>
  )
}
