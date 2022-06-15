import React from 'react'
import { ToastProps } from '../../../types'
import { Alert, Snackbar } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { LoadingTranslations } from './LoadingTranslations'

export function StyledToast({ outcome, message, onClose, autoHideDuration }: ToastProps) {
  const { t, ready } = useTranslation('shared-components', {
    keyPrefix: 'styledToast',
    useSuspense: false,
  })

  if (!ready) {
    return <LoadingTranslations />
  }

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
