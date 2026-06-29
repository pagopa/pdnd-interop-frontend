import { EServiceMutations } from '@/api/eservice'
import { DOCUMENTATION_URL, GRACE_PERIOD_ARCHIVING_ESERVICE } from '@/config/env'
import { useDialog } from '@/stores'
import type { DialogArchiveEserviceProps } from '@/types/dialog.types'
import { formatDateStringNumeric } from '@/utils/format.utils'
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
import { calculateArchivableOn } from '@/utils/eservice.utils'
import { useIsActionDisabledBySupport } from '@/hooks/useIsActionDisabledBySupport'

type ArchiveReasonFormValue = {
  reason: string
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

  const onSubmit = ({ reason }: ArchiveReasonFormValue) => {
    scheduleArchive({ eserviceId, archivingReason: reason }, { onSuccess: closeDialog })
  }

  const archiveDate = calculateArchivableOn(new Date(), GRACE_PERIOD_ARCHIVING_ESERVICE)
  const formattedArchiveDate = formatDateStringNumeric(archiveDate)
  const isForwardActionDisabled = useIsActionDisabledBySupport()

  const formMethods = useForm<ArchiveReasonFormValue>({
    defaultValues: { reason: '' },
  })

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
      <FormProvider {...formMethods}>
        <DialogContent>
          {activeStep === 'ADVISE' && (
            <Typography variant="body2">
              <Trans
                components={{
                  strong: <Typography component="span" variant="inherit" fontWeight={600} />,
                }}
              >
                {t('content.advice.description', { date: formattedArchiveDate })}
              </Trans>
            </Typography>
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
                1: <Link underline="hover" href={DOCUMENTATION_URL} target="_blank" />,
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
            disabled={isForwardActionDisabled}
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
