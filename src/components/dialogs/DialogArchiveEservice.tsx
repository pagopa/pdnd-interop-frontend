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

const DialogArchiveEservice: React.FC<DialogArchiveEserviceProps> = ({
  eserviceId,
  isDelegate,
  delegatorName,
}) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogArchiveEservice',
  })

  const [activeStep, setActiveStep] = useState<'ADVISE' | 'CONFIRM'>('ADVISE')

  const { closeDialog } = useDialog()
  const { mutate: scheduleArchive } = EServiceMutations.useScheduleArchiveEservice()
  const { mutate: requestArchive } = EServiceMutations.useRequestArchiveEservice()

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
    const payload = {
      eserviceId,
      archivingReason: reason,
      gracePeriodDays: Number(gracePeriodDays) as GracePeriodDays,
    }

    if (isDelegate) {
      requestArchive(payload, { onSuccess: closeDialog })
      return
    }

    scheduleArchive(payload, { onSuccess: closeDialog })
  }

  const titleKey = isDelegate ? 'titleDelegate' : 'title'
  const adviceDescriptionKey = isDelegate
    ? 'content.advice.descriptionDelegate'
    : 'content.advice.description'
  const confirmDescriptionKey = isDelegate
    ? 'content.confirm.descriptionDelegate'
    : 'content.confirm.description'

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t(titleKey)}</DialogTitle>
      <FormProvider {...formMethods}>
        <DialogContent>
          {activeStep === 'ADVISE' && (
            <Stack spacing={3}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {t(adviceDescriptionKey, { name: delegatorName ?? '' })}
              </Typography>
              <GracePeriodField
                description={t('content.advice.gracePeriodDescription')}
                isDelegate={isDelegate}
              />
            </Stack>
          )}

          {activeStep === 'CONFIRM' && (
            <Stack spacing={4}>
              <Typography variant="body2">
                {t(confirmDescriptionKey, { name: delegatorName ?? '' })}
              </Typography>
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
            {activeStep === 'ADVISE'
              ? t('actions.forward')
              : isDelegate
                ? t('actions.requestArchiving')
                : tCommon('archive')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
}

export default DialogArchiveEservice
