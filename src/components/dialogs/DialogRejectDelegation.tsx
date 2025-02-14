import { DelegationMutations } from '@/api/delegation'
import { useDialog } from '@/stores'
import type { DialogRejectDelegationProps } from '@/types/dialog.types'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFTextField } from '../shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

type RejectDelegationFormValues = {
  reason: string
}

export const DialogRejectDelegation: React.FC<DialogRejectDelegationProps> = ({
  delegationId,
  delegationKind,
}) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogRejectDelegation',
  })
  const { closeDialog } = useDialog()

  const { mutate: rejectProducerDelegation } = DelegationMutations.useRejectProducerDelegation()
  const { mutate: rejectConsumerDelegation } = DelegationMutations.useRejectConsumerDelegation()

  const rejectDelegation = match(delegationKind)
    .with('DELEGATED_PRODUCER', () => rejectProducerDelegation)
    .with('DELEGATED_CONSUMER', () => rejectConsumerDelegation)
    .exhaustive()

  const formMethods = useForm<RejectDelegationFormValues>({
    defaultValues: { reason: '' },
  })

  const isSubmitButtonEnabled = formMethods.watch('reason') !== ''

  const onSubmit = ({ reason }: RejectDelegationFormValues) => {
    rejectDelegation({ delegationId, rejectionReason: reason })
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
            <RHFTextField
              name="reason"
              label={t('content.reason.label')}
              infoLabel={t('content.reason.infoLabel')}
              focusOnMount
              multiline
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10 }}
            />
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {tCommon('cancel')}
            </Button>
            <Button variant="contained" type="submit" disabled={!isSubmitButtonEnabled}>
              {t('actions.reject')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
