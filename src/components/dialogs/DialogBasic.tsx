import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import type { DialogBasicProps } from '@/types/dialog.types'
import { useDialog } from '@/stores'

export const DialogBasic: React.FC<DialogBasicProps> = ({
  title = 'Conferma azione',
  description,
  onProceed,
  onCancel,
  proceedLabel,
  disabled = false,
  maxWidth,
}) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()
  const { closeDialog } = useDialog()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const handleCancel = () => {
    onCancel?.()
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
      {...(description ? { 'aria-describedby': ariaDescriptionId } : {})}
      maxWidth={maxWidth}
      fullWidth
    >
      <DialogTitle id={ariaLabelId}>{title}</DialogTitle>

      {description && (
        <DialogContent id={ariaDescriptionId}>
          <Trans
            components={{
              strong: <Typography component="span" variant="inherit" fontWeight={600} />,
            }}
          >
            {description}
          </Trans>
        </DialogContent>
      )}

      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          {tCommon('cancel')}
        </Button>
        <Button variant="contained" onClick={handleProceed} disabled={disabled}>
          {proceedLabel ?? tCommon('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
