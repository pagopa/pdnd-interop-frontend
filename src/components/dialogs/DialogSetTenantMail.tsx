import { AuthHooks } from '@/api/auth'
import { TenantMutations } from '@/api/tenant'
import { useDialog } from '@/stores'
import type { DialogSetTenantMailProps } from '@/types/dialog.types'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import isEqual from 'lodash/isEqual'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFTextField } from '../shared/react-hook-form-inputs'
import { emailRegex } from '@/utils/form.utils'

type SetTenantMailFormValues = {
  contactEmail: string
  description: string
}

export const DialogSetTenantMail: React.FC<DialogSetTenantMailProps> = () => {
  const ariaLabelId = React.useId()

  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogSetTenantMail',
  })
  const { t: tCommon } = useTranslation('common')
  const { jwt } = AuthHooks.useJwt()

  const { closeDialog } = useDialog()
  const { mutateAsync: setMail } = TenantMutations.useUpdateMail()

  const defaultValues = {
    contactEmail: '',
    description: '',
  }

  const formMethods = useForm<SetTenantMailFormValues>({
    defaultValues,
  })

  const onSubmit = (values: SetTenantMailFormValues) => {
    if (!jwt?.organizationId) return
    if (!isEqual(defaultValues, values)) {
      const { contactEmail, description } = values
      setMail(
        {
          partyId: jwt.organizationId,
          address: contactEmail,
          kind: 'CONTACT_EMAIL',
          description: description || undefined,
        },
        {
          onSuccess: closeDialog,
        }
      )
    }
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth maxWidth="md">
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

          <DialogContent>
            <Typography variant="body1">{t('description')}</Typography>
            <RHFTextField
              sx={{ mt: 2, mb: 0 }}
              focusOnMount
              name="contactEmail"
              label={t('content.mailField.label')}
              rules={{
                required: true,
                pattern: {
                  value: emailRegex,
                  message: tCommon('validation.string.email'),
                },
              }}
            />
            <RHFTextField
              sx={{ mt: 2, mb: 0 }}
              name="description"
              label={t('content.descriptionField.label')}
              infoLabel={t('content.descriptionField.infoLabel')}
              inputProps={{ maxLength: 250 }}
              multiline
              rules={{
                validate: (value) =>
                  !value ||
                  (value as string).length >= 10 ||
                  tCommon('validation.string.minLength', { min: 10 }),
              }}
            />
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {tCommon('actions.cancel')}
            </Button>
            <Button variant="contained" type="submit">
              {tCommon('actions.confirm')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
