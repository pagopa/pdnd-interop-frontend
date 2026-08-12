import { EServiceMutations } from '@/api/eservice'
import type { GracePeriodDays } from '@/api/api.generatedTypes'
import { archivingGuideLink, DEFAULT_GRACE_PERIOD_DAYS } from '@/config/constants'
import { useDialog } from '@/stores'
import type { DialogArchiveEserviceProps } from '@/types/dialog.types'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { RHFTextField } from '../shared/react-hook-form-inputs'
import { RequiredTextLabel } from '../shared/RequiredTextLabel'
import { GracePeriodField } from '../shared/GracePeriodField'

type ArchiveEserviceFormValues = {
  reason: string
  gracePeriodDays: string
}

const DialogArchiveEservice: React.FC<DialogArchiveEserviceProps> = ({ eserviceId }) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogArchiveEservice',
  })

  const [activeStep, setActiveStep] = useState<'ADVISE' | 'CONFIRM'>('ADVISE')

  const { closeDialog } = useDialog()
  const { mutate: scheduleArchive } = EServiceMutations.useScheduleArchiveEservice()

  const formMethods = useForm<ArchiveEserviceFormValues>({
    defaultValues: { reason: '', gracePeriodDays: String(DEFAULT_GRACE_PERIOD_DAYS) },
  })

  const handleBackAction = () => {
    if (activeStep === 'ADVISE') {
      closeDialog()
    }

    if (activeStep === 'CONFIRM') {
      setActiveStep('ADVISE')
    }
  }

  const handleForwardAction = () => {
    setActiveStep('CONFIRM')
  }

  const onSubmit = ({ reason, gracePeriodDays }: ArchiveEserviceFormValues) => {
    scheduleArchive(
      {
        eserviceId,
        archivingReason: reason,
        gracePeriodDays: Number(gracePeriodDays) as GracePeriodDays,
      },
      { onSuccess: closeDialog }
    )
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
      <FormProvider {...formMethods}>
        <DialogContent>
          {activeStep === 'ADVISE' && (
            <Stack spacing={3}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {t('content.advice.description')}
              </Typography>
              <GracePeriodField description={t('content.advice.gracePeriodDescription')} />
            </Stack>
          )}

          {activeStep === 'CONFIRM' && (
            <Stack spacing={4}>
              <Typography variant="body2">{t('content.confirm.description')}</Typography>
              <Box component="form" noValidate>
                <RequiredTextLabel />
                <RHFTextField
                  name="reason"
                  label={t('content.confirm.form.label')}
                  infoLabel={t('content.confirm.form.infoLabel')}
                  focusOnMount
                  multiline
                  inputProps={{ maxLength: 250 }}
                  rules={{ required: true, minLength: 10, maxLength: 250 }}
                  required
                  size="small"
                />
              </Box>
            </Stack>
          )}

          <Alert severity="info" sx={{ mt: 4 }}>
            <Trans
              components={{
                1: <Link underline="hover" href={archivingGuideLink} target="_blank" />,
              }}
            >
              {t('content.alert')}
            </Trans>
          </Alert>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary" onClick={handleBackAction}>
            {activeStep === 'ADVISE' ? tCommon('cancel') : t('actions.back')}
          </Button>
          <Button
            variant="contained"
            color={activeStep === 'ADVISE' ? 'primary' : 'error'}
            onClick={
              activeStep === 'ADVISE' ? handleForwardAction : formMethods.handleSubmit(onSubmit)
            }
            sx={activeStep === 'CONFIRM' ? { color: 'common.white' } : undefined}
          >
            {activeStep === 'ADVISE' ? t('actions.forward') : tCommon('archive')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
}

export default DialogArchiveEservice
