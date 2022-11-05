import React from 'react'
import { ClientMutations } from '@/api/client'
import { useDialog } from '@/contexts'
import { DialogAddSecurityOperatorKeyProps } from '@/types/dialog.types'
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
import { TextField } from '../shared/ReactHookFormInputs'
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type AddSecurityOperatorKeyFormValues = {
  name: string
  key: string
}

export const DialogAddSecurityOperatorKey: React.FC<DialogAddSecurityOperatorKeyProps> = ({
  clientId,
}) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogAddSecurityOperatorKeys',
  })
  const { closeDialog } = useDialog()
  const { mutate: postKey } = ClientMutations.usePostKey()

  const validationSchema = object({
    name: string().required(),
    key: string().required(),
  })

  const formMethods = useForm<AddSecurityOperatorKeyFormValues>({
    defaultValues: { name: '', key: '' },
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = (values: AddSecurityOperatorKeyFormValues) => {
    closeDialog()
    const { key, name } = values
    postKey({ clientId, use: 'SIG', alg: 'RS256', name, key: btoa(key.trim()) })
  }

  return (
    <Dialog open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle>{t('title')}</DialogTitle>

          <DialogContent>
            <TextField
              name="name"
              label={t('content.nameField.label')}
              infoLabel={t('content.nameField.infoLabel')}
              focusOnMount
              inputProps={{ maxLength: 60 }}
            />

            <TextField
              name="key"
              label={t('content.keyField.label')}
              multiline
              rows={6}
              sx={{ mb: 2 }}
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
