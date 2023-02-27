import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDialog } from '@/stores'
import type { DialogUpdatePurposeDailyCallsProps } from '@/types/dialog.types'
import { RHFTextField } from '../shared/react-hook-form-inputs'
import { PurposeMutations } from '@/api/purpose'
import { FormProvider, useForm } from 'react-hook-form'

type UpdateDailyCallsFormValues = { dailyCalls: number }

export const DialogUpdatePurposeDailyCalls: React.FC<DialogUpdatePurposeDailyCallsProps> = ({
  purposeId,
  dailyCalls = 1,
}) => {
  const ariaLabelId = React.useId()
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogUpdatePurposeDailyCalls',
  })

  const formMethods = useForm<UpdateDailyCallsFormValues>({
    defaultValues: {
      dailyCalls,
    },
  })

  const { closeDialog } = useDialog()
  const { mutate: updateDailyCalls } = PurposeMutations.useUpdateDailyCalls()

  const onSubmit = ({ dailyCalls }: UpdateDailyCallsFormValues) => {
    updateDailyCalls({ purposeId, dailyCalls }, { onSuccess: closeDialog })
  }

  return (
    <Dialog open onClose={closeDialog} aria-labelledby={ariaLabelId} fullWidth>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

        <DialogContent>
          <FormProvider {...formMethods}>
            <RHFTextField
              type="number"
              name="dailyCalls"
              label={t('content.dailyCallsField.label')}
              infoLabel={t('content.dailyCallsField.infoLabel')}
              focusOnMount={true}
              inputProps={{ min: '1' }}
              rules={{ required: true, min: 1 }}
            />
          </FormProvider>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={closeDialog}>
            {t('actions.cancelLabel')}
          </Button>
          <Button variant="contained" type="submit">
            {t('actions.confirmLabel')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
