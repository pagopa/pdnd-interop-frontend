import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
} from '@mui/material'
import { useDialog } from '@/stores'
import type { DialogDelegatorRejectArchivingVersionProps } from '@/types/dialog.types'
import { useTranslation } from 'react-i18next'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { RHFTextField } from '../shared/react-hook-form-inputs'
import { RequiredTextLabel } from '@/components/shared/RequiredTextLabel'
import { EServiceMutations } from '@/api/eservice'

type RejectArchivingDelegatedFormValues = {
  reason: string
}

const DialogDelegatorRejectArchivingVersion: React.FC<
  DialogDelegatorRejectArchivingVersionProps
> = ({ eserviceId, descriptorId, delegatedName }) => {
  const ariaLabelId = React.useId()
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const { closeDialog } = useDialog()
  const { mutate: rejectVersionRequest } =
    EServiceMutations.useRejectDelegatedArchivingVersionRequest()

  const formMethods = useForm<RejectArchivingDelegatedFormValues>({
    defaultValues: { reason: '' },
  })

  const onSubmit: SubmitHandler<RejectArchivingDelegatedFormValues> = (values) => {
    if (!values.reason) return

    rejectVersionRequest(
      { eserviceId, descriptorId, rejectionReason: values.reason },
      { onSuccess: closeDialog }
    )
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle>{t('dialogRejectArchivingDelegated.title')}</DialogTitle>

          <DialogContent>
            <Typography variant="body2" sx={{ mb: 3 }}>
              {t('dialogRejectArchivingDelegated.paragraph', { entity: delegatedName })}
            </Typography>
            <RequiredTextLabel />
            <RHFTextField
              name="reason"
              label={t('dialogRejectArchivingDelegated.fieldLabel')}
              infoLabel={t('dialogRejectArchivingDelegated.fieldInfoLabel')}
              focusOnMount
              required
              multiline
              inputProps={{ maxLength: 1000 }}
              rules={{ required: true, minLength: 20 }}
            />
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {t('dialogRejectArchivingDelegated.cancel')}
            </Button>
            <Button variant="contained" type="submit">
              {t('dialogRejectArchivingDelegated.confirm')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}

export default DialogDelegatorRejectArchivingVersion
