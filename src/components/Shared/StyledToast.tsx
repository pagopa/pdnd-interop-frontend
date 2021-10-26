import React from 'react'
import { RequestOutcome, ToastContent, ToastContentWithOutcome } from '../../../types'
import { Alert, AlertTitle, Snackbar } from '@mui/material'

type StyledToastProps = ToastContentWithOutcome & {
  onClose?: any
}

const DEFAULT_TEXT: { [key in RequestOutcome]: ToastContent } = {
  success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
  error: {
    title: 'Errore',
    description: "C'è stato un errore, non è stato possibile completare l'operazione",
  },
}

export function StyledToast({ outcome, title, description, onClose }: StyledToastProps) {
  return (
    <Snackbar
      open={true}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={outcome} onClose={onClose}>
        <AlertTitle>{title || DEFAULT_TEXT[outcome].title}</AlertTitle>
        {description || DEFAULT_TEXT[outcome].description}
      </Alert>
    </Snackbar>
  )
}
