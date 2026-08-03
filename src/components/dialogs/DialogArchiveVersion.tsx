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
  isDelegate,
  delegatorName,
}) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogArchiveVersion',
  })

  const { closeDialog } = useDialog()
  const { mutate: scheduleArchive } = EServiceMutations.useScheduleArchiveDescriptor()
  const { mutate: requestArchive } = EServiceMutations.useRequestArchiveDescriptor()

  const formMethods = useForm<ArchiveVersionFormValues>({
    defaultValues: { gracePeriodDays: String(DEFAULT_GRACE_PERIOD_DAYS) },
  })

  const handleCancel = () => {
    closeDialog()
  }

  const handleArchive = () => {
    const gracePeriodDays = Number(formMethods.getValues('gracePeriodDays')) as GracePeriodDays
    if (isDelegate) {
      requestArchive({ eserviceId, descriptorId, gracePeriodDays }, { onSuccess: closeDialog })
      return
    }

    scheduleArchive({ eserviceId, descriptorId, gracePeriodDays }, { onSuccess: closeDialog })
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{isDelegate ? t('titleDelegate') : t('title')}</DialogTitle>
      <FormProvider {...formMethods}>
        <DialogContent>
          <Stack spacing={3}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              <Trans
                t={t}
                i18nKey={isDelegate ? 'content.descriptionDelegate' : 'content.description'}
                values={isDelegate ? { name: delegatorName ?? '' } : undefined}
              />
            </Typography>
            <GracePeriodField isDelegate={isDelegate} />
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
            {isDelegate ? t('actions.requestArchiving') : tCommon('archive')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
}
