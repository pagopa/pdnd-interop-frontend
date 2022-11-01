import React from 'react'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/config/theme'
import { ToastNotificationContextProvider } from './ToastNotificationContext'
import { LoadingOverlayContextProvider } from './LoadingOverlayContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <LoadingOverlayContextProvider>
          <ToastNotificationContextProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </ToastNotificationContextProvider>
        </LoadingOverlayContextProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default ProvidersWrapper
