import React from 'react'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/config/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClientConfig } from '@/config/query-client'

const queryClient = new QueryClient(queryClientConfig)

const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default ProvidersWrapper
