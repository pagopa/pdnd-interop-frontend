import React, { FunctionComponent } from 'react'
import { object, date } from 'yup'
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
import { yupResolver } from '@hookform/resolvers/yup'
import { DialogSetPurposeExpectedApprovalDateProps } from '@/types/dialog.types'
import { useDialog } from '@/contexts'
import { DatePicker } from '../shared/ReactHookFormInputs'
import { PurposeMutations } from '@/api/purpose'

type ExpectedApprovalDateFormValues = {
  expectedApprovalDate: Date
}

export const DialogSetPurposeExpectedApprovalDate: FunctionComponent<
  DialogSetPurposeExpectedApprovalDateProps
> = ({ purposeId, versionId, approvalDate }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogSetPurposeExpectedApprovalDate',
  })
  const { closeDialog } = useDialog()
  const { mutate: updateWaitingForApprovalDate } =
    PurposeMutations.useUpdateVersionWaitingForApproval()

  const onSubmit = async ({ expectedApprovalDate }: ExpectedApprovalDateFormValues) => {
    closeDialog()
    updateWaitingForApprovalDate({ purposeId, versionId, expectedApprovalDate })
  }

  const formMethods = useForm<ExpectedApprovalDateFormValues>({
    defaultValues: { expectedApprovalDate: approvalDate ? new Date(approvalDate) : new Date() },
    resolver: yupResolver(object({ expectedApprovalDate: date().required() })),
  })

  return (
    <Dialog open onClose={closeDialog} fullWidth>
      <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
        <FormProvider {...formMethods}>
          <DialogTitle>{t('title')}</DialogTitle>

          <DialogContent>
            <Typography>{t('content.message')}</Typography>
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
              <DatePicker sx={{ my: 0 }} name="expectedApprovalDate" />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={closeDialog}>
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
