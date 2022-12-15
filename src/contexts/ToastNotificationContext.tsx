import React from 'react'
import { Alert, AlertProps, Snackbar, Typography } from '@mui/material'
import noop from 'lodash/noop'
import { createSafeContext } from './utils'
import { Trans } from 'react-i18next'

type ToastState = {
  isOpen: boolean
  message: string | React.ReactNode
  severity: AlertProps['severity']
}

type ToastNotificationContextType = {
  showToast: (message: string | React.ReactNode, severity: AlertProps['severity']) => void
  hideToast: () => void
}

const { useContext: useToastNotification, Provider } =
  createSafeContext<ToastNotificationContextType>('ToastNotificationContext', {
    showToast: noop,
    hideToast: noop,
  })

const _ToastNotification: React.FC<ToastState> = (toastState) => {
  const { hideToast } = useToastNotification()
  const id = React.useId()

  const handleClose = () => {
    hideToast()
  }

  return (
    <Snackbar
      open={toastState.isOpen}
      onClose={handleClose}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ maxWidth: 480 }}
    >
      <Alert
        aria-labelledby={id}
        severity={toastState.severity}
        onClose={handleClose}
        variant="outlined"
      >
        <Trans
          components={{
            strong: <Typography component="span" variant="inherit" fontWeight={600} />,
          }}
        >
          <span id={id}>{toastState.message}</span>
        </Trans>
      </Alert>
    </Snackbar>
  )
}

const ToastNotification = React.memo(_ToastNotification)

const ToastNotificationContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = React.useState<ToastState>({
    isOpen: false,
    message: '',
    severity: 'success',
  })

  const showToast = React.useCallback(
    (message: string | React.ReactNode, severity: AlertProps['severity']) => {
      setToast({ isOpen: true, message, severity })
    },
    []
  )

  const hideToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const value = React.useMemo(() => ({ showToast, hideToast }), [showToast, hideToast])

  return (
    <Provider value={value}>
      {children}
      <ToastNotification {...toast} />
    </Provider>
  )
}

export { useToastNotification, ToastNotificationContextProvider }
