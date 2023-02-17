import React, { FunctionComponent } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import { DialogSetPurposeExpectedApprovalDateProps } from '@/types/dialog.types'
import { useDialog } from '@/stores'
import { DatePicker } from '../shared/ReactHookFormInputs'
import { PurposeMutations } from '@/api/purpose'

type ExpectedApprovalDateFormValues = {
  expectedApprovalDate: Date
}

export const DialogSetPurposeExpectedApprovalDate: FunctionComponent<
  DialogSetPurposeExpectedApprovalDateProps
> = ({ purposeId, versionId, approvalDate }) => {
  const ariaLabelId = React.useId()

  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogSetPurposeExpectedApprovalDate',
  })
  const { closeDialog } = useDialog()
  const { mutate: updateWaitingForApprovalDate } =
    PurposeMutations.useUpdateVersionWaitingForApproval()

  const onSubmit = async ({ expectedApprovalDate }: ExpectedApprovalDateFormValues) => {
    updateWaitingForApprovalDate(
      { purposeId, versionId, expectedApprovalDate },
      { onSuccess: closeDialog }
    )
  }

  const formMethods = useForm<ExpectedApprovalDateFormValues>({
    defaultValues: { expectedApprovalDate: approvalDate ? new Date(approvalDate) : new Date() },
  })

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
        <FormProvider {...formMethods}>
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

          <DialogContent>
            <Typography>{t('content.message')}</Typography>
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
              <DatePicker sx={{ my: 0 }} name="expectedApprovalDate" rules={{ required: true }} />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {t('actions.cancelLabel')}
            </Button>
            <Button variant="contained" type="submit">
              {t('actions.confirmLabel')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Box>
    </Dialog>
  )
}
