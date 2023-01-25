import React from 'react'
import { Alert, Snackbar, Typography } from '@mui/material'
import { useToastNotification, useToastNotificationStore } from '@/contexts'
import { Trans } from 'react-i18next'

const _ToastNotification: React.FC = () => {
  const { hideToast } = useToastNotification()
  const isShown = useToastNotificationStore((state) => state.isShown)
  const message = useToastNotificationStore((state) => state.message)
  const severity = useToastNotificationStore((state) => state.severity)

  const id = React.useId()

  return (
    <Snackbar
      open={isShown}
      onClose={hideToast}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ maxWidth: 480 }}
    >
      <Alert aria-labelledby={id} severity={severity} onClose={hideToast} variant="outlined">
        <Trans
          components={{
            strong: <Typography component="span" variant="inherit" fontWeight={600} />,
          }}
        >
          <span id={id}>{message}</span>
        </Trans>
      </Alert>
    </Snackbar>
  )
}

export const ToastNotification = React.memo(_ToastNotification)
