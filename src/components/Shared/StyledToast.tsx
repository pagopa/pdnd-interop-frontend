import React from 'react'
import { RequestOutcome, ToastContent, ToastProps } from '../../../types'
import { Alert, Snackbar } from '@mui/material'

const DEFAULT_TEXT: Record<RequestOutcome, ToastContent> = {
  success: { message: "L'operazione è andata a buon fine" },
  error: {
    message: "Errore: non è stato possibile completare l'operazione",
  },
}

export function StyledToast({ outcome, message, onClose, autoHideDuration }: ToastProps) {
  return (
    <Snackbar
      open={true}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ maxWidth: 480 }}
    >
      <Alert severity={outcome} onClose={onClose} variant="outlined">
        {message || DEFAULT_TEXT[outcome].message}
      </Alert>
    </Snackbar>
  )
}
