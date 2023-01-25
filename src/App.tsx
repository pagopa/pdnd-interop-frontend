import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'
import { Spinner } from '@/components/shared/Spinner'
import { RouterProvider } from '@/router'
import { LoadingOverlay, ToastNotification } from '@/components/layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryClientConfig } from '@/config/query-client'
import { theme } from '@/config/theme'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient(queryClientConfig)

function App() {
  return (
    <ThemeProvider theme={theme}>
      <React.Suspense fallback={<FirstLoadingSpinner />}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <RouterProvider />
          <LoadingOverlay />
          <ToastNotification />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </React.Suspense>
    </ThemeProvider>
  )
}

const FirstLoadingSpinner: React.FC = () => {
  return <Spinner sx={{ height: '100vh' }} />
}

export default App
