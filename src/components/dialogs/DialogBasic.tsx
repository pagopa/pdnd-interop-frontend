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
  proceedLabel = 'Conferma',
  disabled = false,
  maxWidth,
}) => {
  const dialogTitleId = useId()
  const dialogDescriptionId = useId()
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'styledDialogBasic',
  })
  const { closeDialog } = useDialog()

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
          {t('actions.cancelLabel')}
        </Button>
        <Button variant="contained" onClick={proceedCallback} disabled={disabled}>
          {proceedLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
