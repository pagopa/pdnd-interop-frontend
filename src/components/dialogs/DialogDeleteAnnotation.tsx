import { useDialog } from '@/stores'
import type { DialogDeleteAnnotationProps } from '@/types/dialog.types'
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

export const DialogDeleteAnnotation: React.FC<DialogDeleteAnnotationProps> = ({ onProceed }) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()
  const { closeDialog } = useDialog()
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'catalogCard.deleteAnnotationDialog',
  })

  const handleCancel = () => {
    closeDialog()
  }

  const handleProceed = () => {
    onProceed()
    closeDialog()
  }

  return (
    <Dialog
      open
      onClose={handleCancel}
      aria-labelledby={ariaLabelId}
      aria-describedby={ariaDescriptionId}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent id={ariaDescriptionId}>
        <Typography variant="body1">{t('description')}</Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          {t('cancelLabel')}
        </Button>
        <Button variant="outlined" color="error" onClick={handleProceed}>
          {t('proceedLabel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
