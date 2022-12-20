import React from 'react'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/config/theme'
import { ToastNotificationContextProvider } from './ToastNotificationContext'
import { LoadingOverlayContextProvider } from './LoadingOverlayContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClientConfig } from '@/config/query-client'
import { QueriesPollingContextProvider } from './QueriesPollingContext'

const queryClient = new QueryClient(queryClientConfig)

const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <LoadingOverlayContextProvider>
        <ToastNotificationContextProvider>
          <QueryClientProvider client={queryClient}>
            <QueriesPollingContextProvider>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </QueriesPollingContextProvider>
          </QueryClientProvider>
        </ToastNotificationContextProvider>
      </LoadingOverlayContextProvider>
    </ThemeProvider>
  )
}

export default ProvidersWrapper
