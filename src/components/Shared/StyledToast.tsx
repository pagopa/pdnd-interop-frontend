import React from 'react'
import { RequestOutcome, ToastContent, ToastProps } from '../../../types'
import { Alert, AlertTitle, Snackbar } from '@mui/material'

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
  return (
    <Snackbar
      open={true}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={outcome} onClose={onClose}>
        <AlertTitle>{title || DEFAULT_TEXT[outcome].title}</AlertTitle>
        {description || DEFAULT_TEXT[outcome].description}
      </Alert>
    </Snackbar>
  )
}
