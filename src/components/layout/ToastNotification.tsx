import React from 'react'
import { Alert, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { useToastNotification, useToastNotificationStore } from '@/stores'
import { useTranslation } from 'react-i18next'
import { CopyToClipboardButton } from '@pagopa/mui-italia'

const _ToastNotification: React.FC = () => {
  const { hideToast } = useToastNotification()
  const isShown = useToastNotificationStore((state) => state.isShown)
  const message = useToastNotificationStore((state) => state.message)
  const severity = useToastNotificationStore((state) => state.severity)
  const correlationId = useToastNotificationStore((state) => state.correlationId)
  const { t } = useTranslation('error')

  const id = React.useId()

  const correlationIdSection = (
    <>
      <Typography variant="inherit" sx={{ mb: 2.5, mt: 1 }}>
        {t('axiosError.correlationIdText')}
      </Typography>
      <TextField
        size="small"
        id="outlined-read-only-input"
        label="Identificativo"
        defaultValue={correlationId}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <CopyToClipboardButton
              value={correlationId!}
              tooltipTitle={t('axiosError.tooltipTitle')}
            />
          ),
        }}
      />
    </>
  )

  return (
    <Snackbar
      open={isShown}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ maxWidth: 480 }}
      onClose={hideToast}
    >
      <Alert aria-labelledby={id} severity={severity} variant="outlined">
        <Stack justifyContent="center" alignItems="center" spacing={2}>
          <Typography fontWeight={400} variant="inherit">
            <span id={id}>
              {message}
              {correlationId && correlationIdSection}
            </span>
          </Typography>
        </Stack>
      </Alert>
    </Snackbar>
  )
}

export const ToastNotification = React.memo(_ToastNotification)
