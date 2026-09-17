import { useDialog } from '@/stores'
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

export const DialogBlockArchivingRequest: React.FC = () => {
  const ariaLabelId = React.useId()

  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.dialogBlockArchivingRequest',
  })

  const { closeDialog } = useDialog()

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth maxWidth="sm">
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
          {t('description')}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={closeDialog}>
          {t('actions.goBack')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
