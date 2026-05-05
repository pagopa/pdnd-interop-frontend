import { DOCUMENTATION_URL } from '@/config/env'
import { useDialog } from '@/stores'
import type { DialogArchiveVersionProps } from '@/types/dialog.types'
import { formatDateStringAllDigit } from '@/utils/format.utils'
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
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

const DialogArchiveVersion: React.FC<DialogArchiveVersionProps> = ({
  archiveDate,
  eserviceId,
  descriptorId,
}) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogArchiveVersion',
  })

  // TODO mutation with archive version archiving api

  const { closeDialog } = useDialog()

  const handleCancel = () => {
    closeDialog()
  }

  const handleArchive = () => {
    // TODO call mutation with descriptorId and eventually eserviceId
  }

  const gracePeriod = 30 // TODO get period
  const formattedArchiveDate = '04/05/2026' // formatDateStringAllDigit(archiveDate) // TODO get date

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
      <DialogContent>
        <Typography>
          <Trans
            components={{
              strong: <Typography component="span" variant="inherit" fontWeight={600} />,
            }}
          >
            {(t('content.description'), { days: gracePeriod })}
          </Trans>
        </Typography>

        <Alert severity="info">
          <Trans
            components={{
              1: <Link underline="hover" href={DOCUMENTATION_URL} target="_blank" />, // TODO documentation link
            }}
          >
            {(t('content.alert'), { date: formattedArchiveDate })}
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

export default DialogArchiveVersion
