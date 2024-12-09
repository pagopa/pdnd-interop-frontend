import { PurposeMutations } from '@/api/purpose'
import { useDialog } from '@/stores'
import type { DialogRejectPurposeVersionProps } from '@/types/dialog.types'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFTextField } from '../shared/react-hook-form-inputs'

type RejectPurposeVersionFormValues = {
  reason: string
}

export const DialogRejectPurposeVersion: React.FC<DialogRejectPurposeVersionProps> = ({
  purposeId,
  versionId,
  isChangePlanRequest,
}) => {
  const ariaLabelId = React.useId()

  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogRejectPurposeVersion',
  })
  const { closeDialog } = useDialog()
  const { mutate: rejectVersion } = PurposeMutations.useRejectVersion()

  const formMethods = useForm<RejectPurposeVersionFormValues>({
    defaultValues: { reason: '' },
  })

  const onSubmit = ({ reason }: RejectPurposeVersionFormValues) => {
    rejectVersion({ purposeId, versionId, rejectionReason: reason })
    closeDialog()
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId} sx={{ pb: 1 }}>
            {t(isChangePlanRequest ? 'title.changePlan' : 'title.newPurpose')}
          </DialogTitle>

          <DialogContent>
            <Typography variant="body2" sx={{ mb: 3 }}>
              {t(isChangePlanRequest ? 'subtitle.changePlan' : 'subtitle.newPurpose')}
            </Typography>
            <RHFTextField
              name="reason"
              label={t('content.reason.label')}
              infoLabel={t(
                isChangePlanRequest
                  ? 'content.reason.infoLabel.changePlan'
                  : 'content.reason.infoLabel.newPurpose'
              )}
              focusOnMount
              multiline
              inputProps={{ maxLength: 1000 }}
              rules={{ required: true, minLength: 20 }}
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
