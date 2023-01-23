import React, { useId } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import { DialogBasicProps } from '@/types/dialog.types'
import { useDialog } from '@/contexts'

export const DialogBasic: React.FC<DialogBasicProps> = ({
  title = 'Conferma azione',
  description,
  proceedCallback,
  proceedLabel,
  disabled = false,
  maxWidth,
}) => {
  const dialogTitleId = useId()
  const dialogDescriptionId = useId()
  const { closeDialog } = useDialog()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  return (
    <Dialog
      open
      onClose={closeDialog}
      aria-labelledby={dialogTitleId}
      {...(description ? { 'aria-describedby': dialogDescriptionId } : {})}
      maxWidth={maxWidth}
      fullWidth
    >
      <DialogTitle id={dialogTitleId}>{title}</DialogTitle>

      {description && (
        <DialogContent aria-describedby={dialogDescriptionId}>
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
        <Button variant="outlined" onClick={closeDialog}>
          {tCommon('cancel')}
        </Button>
        <Button variant="contained" onClick={proceedCallback} disabled={disabled}>
          {proceedLabel ?? tCommon('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
