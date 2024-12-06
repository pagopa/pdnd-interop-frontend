import { EServiceMutations } from '@/api/eservice'
import { useDialog } from '@/stores'
import type { DialogRejectDelegatedVersionDraftProps } from '@/types/dialog.types'
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

type RejectDelegatedVersionDraftFormValues = {
  reason: string
}

export const DialogRejectDelegatedVersionDraft: React.FC<
  DialogRejectDelegatedVersionDraftProps
> = ({ eserviceId, descriptorId }) => {
  const ariaLabelId = React.useId()

  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogRejectDelegatedVersionDraft',
  })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { closeDialog } = useDialog()
  const { mutate: rejectDelegatedVersionDraft } = EServiceMutations.useRejectDelegatedVersionDraft()

  const formMethods = useForm<RejectDelegatedVersionDraftFormValues>({
    defaultValues: { reason: '' },
  })

  const onSubmit = ({ reason }: RejectDelegatedVersionDraftFormValues) => {
    rejectDelegatedVersionDraft({ eserviceId, descriptorId, rejectionReason: reason })
    closeDialog()
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId} sx={{ pb: 1 }}>
            {t('title')}
          </DialogTitle>

          <DialogContent>
            <Typography variant="body2" sx={{ mb: 3 }}>
              {t('description')}
            </Typography>
            <RHFTextField
              name="reason"
              label={t('content.reason.label')}
              infoLabel={t('content.reason.infoLabel')}
              focusOnMount
              multiline
              inputProps={{ maxLength: 1000 }}
              rules={{ required: true, minLength: 20 }}
            />
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {tCommon('cancel')}
            </Button>
            <Button variant="contained" type="submit">
              {tCommon('reject')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
