import React from 'react'
import {
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useToastNotification, useToastNotificationStore } from '@/stores'
import { useTranslation } from 'react-i18next'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

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
      <p>{t('axiosError.correlationIdText')}</p>
      <TextField
        multiline
        id="outlined-read-only-input"
        label="Correlation ID"
        defaultValue={correlationId}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => handleCopyCorrelationId(correlationId)}>
                <ContentCopyIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  )

  async function handleCopyCorrelationId(correlationId: string | undefined) {
    if (!correlationId) return
    try {
      await navigator.clipboard.writeText(correlationId)
    } catch (error) {
      console.error('Unable to copy the correlationId:', error)
    }
  }

  return (
    <Snackbar
      open={isShown}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ maxWidth: 350 }}
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
