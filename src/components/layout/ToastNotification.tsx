import React from 'react'
import { useToastNotification, useToastNotificationStore } from '@/stores'
import { useTranslation } from 'react-i18next'
import { MISnackbar } from '@pagopa/mui-italia'

const _ToastNotification: React.FC = () => {
  const { hideToast } = useToastNotification()
  const isShown = useToastNotificationStore((state) => state.isShown)
  const message = useToastNotificationStore((state) => state.message)
  const severity = useToastNotificationStore((state) => state.severity)
  const correlationId = useToastNotificationStore((state) => state.correlationId)
  const { t } = useTranslation('error')

  const snackbarProps = {
    open: isShown,
    anchorOrigin: { vertical: 'bottom' as const, horizontal: 'right' as const },
    onClose: hideToast,
  }

  if (severity === 'error' && correlationId) {
    return (
      <MISnackbar
        {...snackbarProps}
        severity="error"
        title={message as string}
        description={t('axiosError.correlationIdText')}
        errorCode={correlationId}
        errorCodeAriaLabel="Identificativo"
      />
    )
  }

  return (
    <MISnackbar
      {...snackbarProps}
      severity={severity ?? 'success'}
      description={message as string}
    />
  )
}

export const ToastNotification = React.memo(_ToastNotification)
