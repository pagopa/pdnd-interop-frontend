import { DelegationMutations } from '@/api/delegation'
import { useDialog } from '@/stores'
import type { DialogRejectProducerDelegationProps } from '@/types/dialog.types'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFTextField } from '../shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'

type RejectDelegationFormValues = {
  reason: string
}

export const DialogRejectProducerDelegation: React.FC<DialogRejectProducerDelegationProps> = ({
  delegationId,
}) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogRejectProducerDelegation',
  })
  const { closeDialog } = useDialog()

  const { mutate: rejectDelegation } = DelegationMutations.useRejectProducerDelegation()

  const formMethods = useForm<RejectDelegationFormValues>({
    defaultValues: { reason: '' },
  })

  const onSubmit = ({ reason }: RejectDelegationFormValues) => {
    rejectDelegation({ delegationId, rejectionReason: reason }, { onSuccess: closeDialog })
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId} sx={{ pb: 1 }}>
            {t('title')}
          </DialogTitle>

          <DialogContent>
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
              {t('actions.reject')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
