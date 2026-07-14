import { EServiceMutations } from '@/api/eservice'
import type { GracePeriodDays } from '@/api/api.generatedTypes'
import { archivingGuideLink, DEFAULT_GRACE_PERIOD_DAYS } from '@/config/constants'
import { useDialog } from '@/stores'
import type { DialogArchiveVersionProps } from '@/types/dialog.types'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { GracePeriodField } from '../shared/GracePeriodField'

type ArchiveVersionFormValues = {
  gracePeriodDays: string
}

export const DialogArchiveVersion: React.FC<DialogArchiveVersionProps> = ({
  eserviceId,
  descriptorId,
}) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogArchiveVersion',
  })

  const { closeDialog } = useDialog()
  const { mutate: scheduleArchive } = EServiceMutations.useScheduleArchiveDescriptor()

  const formMethods = useForm<ArchiveVersionFormValues>({
    defaultValues: { gracePeriodDays: String(DEFAULT_GRACE_PERIOD_DAYS) },
  })

  const handleCancel = () => {
    closeDialog()
  }

  const handleArchive = () => {
    const gracePeriodDays = Number(formMethods.getValues('gracePeriodDays')) as GracePeriodDays
    scheduleArchive({ eserviceId, descriptorId, gracePeriodDays }, { onSuccess: closeDialog })
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
      <FormProvider {...formMethods}>
        <DialogContent>
          <Stack spacing={3}>
            <Typography variant="body2">{t('content.description')}</Typography>
            <GracePeriodField />
          </Stack>

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
          <Button variant="outlined" onClick={handleCancel}>
            {tCommon('cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleArchive}
            sx={{ color: 'common.white' }}
          >
            {tCommon('archive')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
}
