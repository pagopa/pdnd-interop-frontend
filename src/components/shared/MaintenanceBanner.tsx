import React from 'react'
import { Alert, AlertTitle, Snackbar } from '@mui/material'
import { useMaintenanceBanner } from '@/hooks/useMaintenanceBanner'

export const MaintenanceBanner: React.FC = () => {
  const id = React.useId()

  const { title, text, isOpen, closeBanner } = useMaintenanceBanner()

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        aria-labelledby={id}
        severity="info"
        onClose={closeBanner}
        variant="filled"
        sx={{ width: 720, pt: 12, pb: 12, borderLeft: 'none' }}
      >
        <AlertTitle id={id} sx={{ fontWeight: 700 }}>
          {title}
        </AlertTitle>
        {text}
      </Alert>
    </Snackbar>
  )
}
