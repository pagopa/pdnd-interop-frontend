import React from 'react'
import { RequestOutcome, ToastContent, ToastProps } from '../../../types'
import { Alert, Snackbar } from '@mui/material'

const DEFAULT_TEXT: Record<RequestOutcome, ToastContent> = {
  success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
  error: {
    title: 'Errore',
    description: "Non è stato possibile completare l'operazione",
  },
}

export function StyledToast({
  outcome,
  title,
  description,
  onClose,
  autoHideDuration,
}: ToastProps) {
  const text = `${title || DEFAULT_TEXT[outcome].title}: ${
    description || DEFAULT_TEXT[outcome].description
  }`

  return (
    <Snackbar
      open={true}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={outcome} onClose={onClose} variant="outlined">
        {text}
      </Alert>
    </Snackbar>
  )
}
