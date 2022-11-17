import React from 'react'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/config/theme'
import { ToastNotificationContextProvider } from './ToastNotificationContext'
import { LoadingOverlayContextProvider } from './LoadingOverlayContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <LoadingOverlayContextProvider>
        <ToastNotificationContextProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ToastNotificationContextProvider>
      </LoadingOverlayContextProvider>
    </ThemeProvider>
  )
}

export default ProvidersWrapper
