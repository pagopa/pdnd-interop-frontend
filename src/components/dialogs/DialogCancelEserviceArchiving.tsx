import { useDialog } from '@/stores'
import type { DialogCancelEserviceArchivingProps } from '@/types/dialog.types'
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

const DialogCancelEserviceArchiving: React.FC<DialogCancelEserviceArchivingProps> = ({
  eserviceId,
}) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogCancelEserviceArchiving',
  })

  // TODO mutation with cancel eservice archiving api

  const { closeDialog } = useDialog()

  const handleKeepArchive = () => {
    closeDialog()
  }

  const handleCancelArchive = () => {
    // TODO call mutation with eserviceId
    closeDialog()
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{t('description')}</Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleKeepArchive}>
          {tCommon('cancel')}
        </Button>
        <Button variant="contained" color="error" onClick={handleCancelArchive}>
          {t('actions.cancelArchiving')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogCancelEserviceArchiving
