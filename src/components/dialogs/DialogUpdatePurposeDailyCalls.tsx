import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDialog } from '@/contexts'
import { DialogUpdatePurposeDailyCallsProps } from '@/types/dialog.types'
import { TextField } from '../shared/ReactHookFormInputs'
import { number, object } from 'yup'
import { PurposeMutations } from '@/api/purpose'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

type UpdateDailyCallsFormValues = { dailyCalls: number }

export const DialogUpdatePurposeDailyCalls: React.FC<DialogUpdatePurposeDailyCallsProps> = ({
  purposeId,
  dailyCalls = 1,
}) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogUpdatePurposeDailyCalls',
  })

  const validationSchema = object({ dailyCalls: number().required() })
  const formMethods = useForm<UpdateDailyCallsFormValues>({
    defaultValues: {
      dailyCalls,
    },
    resolver: yupResolver(validationSchema),
  })

  const { closeDialog } = useDialog()
  const { mutate: updateDailyCalls } = PurposeMutations.useUpdateDailyCalls()

  const onSubmit = ({ dailyCalls }: UpdateDailyCallsFormValues) => {
    updateDailyCalls({ purposeId, dailyCalls }, { onSuccess: closeDialog })
  }

  return (
    <Dialog open onClose={closeDialog} aria-describedby={t('ariaDescribedBy')} fullWidth>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <DialogTitle>{t('title')}</DialogTitle>

        <DialogContent>
          <FormProvider {...formMethods}>
            <TextField
              type="number"
              name="dailyCalls"
              label={t('content.dailyCallsField.label')}
              infoLabel={t('content.dailyCallsField.infoLabel')}
              focusOnMount={true}
              inputProps={{ min: '1' }}
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
