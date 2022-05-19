import React from 'react'
import { ToastProps } from '../../../types'
import { Alert, Snackbar } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function StyledToast({ outcome, message, onClose, autoHideDuration }: ToastProps) {
  const { t } = useTranslation('shared-components', { keyPrefix: 'styledToast' })

  return (
    <Snackbar
      open={true}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ maxWidth: 480 }}
    >
      <Alert severity={outcome} onClose={onClose} variant="outlined">
        {message || t(`default.${outcome}.message`)}
      </Alert>
    </Snackbar>
  )
}
