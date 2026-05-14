import { useDialog } from '@/stores'
import type { DialogCancelVersionArchivingProps } from '@/types/dialog.types'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const DialogCancelVersionArchiving: React.FC<DialogCancelVersionArchivingProps> = ({
  eserviceId,
  descriptorId,
}) => {
  const ariaLabelId = React.useId()

  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogCancelVersionArchiving',
  })

  // TODO mutation with cancel version archiving api

  const { closeDialog } = useDialog()

  const handleKeepArchive = () => {
    closeDialog()
  }

  const handleCancelArchive = () => {
    // TODO call mutation with descriptorId and eventually eserviceId
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{t('description')}</Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleKeepArchive}>
          {t('actions.keepArchiving')}
        </Button>
        <Button variant="contained" color="error" onClick={handleCancelArchive}>
          {t('actions.cancelArchiving')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
