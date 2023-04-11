import React from 'react'
import { ClientMutations } from '@/api/client'
import { useDialog } from '@/stores'
import type { DialogAddSecurityOperatorKeyProps } from '@/types/dialog.types'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RouterLink } from '@/router'
import { RHFTextField } from '../shared/react-hook-form-inputs'

type AddSecurityOperatorKeyFormValues = {
  name: string
  key: string
}

export const DialogAddSecurityOperatorKey: React.FC<DialogAddSecurityOperatorKeyProps> = ({
  clientId,
}) => {
  const ariaLabelId = React.useId()
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogAddSecurityOperatorKeys',
  })
  const { closeDialog } = useDialog()
  const { mutate: postKey } = ClientMutations.usePostKey()

  const formMethods = useForm<AddSecurityOperatorKeyFormValues>({
    defaultValues: { name: '', key: '' },
  })

  const onSubmit = (values: AddSecurityOperatorKeyFormValues) => {
    const { key, name } = values
    postKey(
      { clientId, payload: [{ use: 'SIG', alg: 'RS256', name, key: window.btoa(key.trim()) }] },
      { onSuccess: closeDialog }
    )
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

          <DialogContent>
            <RHFTextField
              name="name"
              label={t('content.nameField.label')}
              infoLabel={t('content.nameField.infoLabel')}
              focusOnMount
              inputProps={{ maxLength: 60 }}
              rules={{ required: true, minLength: 5 }}
            />

            <RHFTextField
              name="key"
              label={t('content.keyField.label')}
              multiline
              sx={{ mb: 2 }}
              rules={{ required: true }}
            />

            <Alert severity="info">
              {t('content.keyField.infoLabel.message')}{' '}
              <RouterLink to="SECURITY_KEY_GUIDE" target="_blank">
                {t('content.keyField.infoLabel.linkLabel')}
              </RouterLink>
            </Alert>
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
