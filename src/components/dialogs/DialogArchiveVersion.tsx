import { EServiceMutations } from '@/api/eservice'
import { DOCUMENTATION_URL, GRACE_PERIOD_ARCHIVING_ESERVICE } from '@/config/env'
import { useDialog } from '@/stores'
import type { DialogArchiveVersionProps } from '@/types/dialog.types'
import { formatDateStringNumeric } from '@/utils/format.utils'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
} from '@mui/material'
import addDays from 'date-fns/addDays'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

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

  const handleCancel = () => {
    closeDialog()
  }

  const handleArchive = () => {
    scheduleArchive({ eserviceId, descriptorId }, { onSuccess: closeDialog })
  }

  const archiveDate = addDays(new Date(), GRACE_PERIOD_ARCHIVING_ESERVICE)
  const formattedArchiveDate = formatDateStringNumeric(archiveDate)

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          <Trans
            components={{
              strong: <Typography component="span" variant="inherit" fontWeight={600} />,
            }}
          >
            {t('content.description', { date: formattedArchiveDate })}
          </Trans>
        </Typography>

        <Alert severity="info" sx={{ mt: 4 }}>
          <Trans
            components={{
              1: <Link underline="hover" href={DOCUMENTATION_URL} target="_blank" />, // TODO documentation link
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
        <Button variant="contained" onClick={handleArchive}>
          {tCommon('archive')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
