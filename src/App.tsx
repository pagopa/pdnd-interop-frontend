import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'
import { RouterProvider } from '@/router'
import { LoadingOverlay, ToastNotification } from '@/components/layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryClientConfig } from '@/config/query-client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { theme, Spinner } from '@pagopa/interop-fe-commons'
import { EnvironmentBanner } from '@pagopa/mui-italia'
import { STAGE } from './config/env'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useTranslation } from 'react-i18next'
import { MaintenanceBanner } from './components/shared/MaintenanceBanner'
import { AuthQueryKeys } from './api/auth'
import AuthServices from './api/auth/auth.services'

const queryClient = new QueryClient(queryClientConfig)
queryClient.prefetchQuery([AuthQueryKeys.GetSessionToken], AuthServices.getSessionToken)

function App() {
  const { t } = useTranslation('shared-components')
  return (
    <ThemeProvider theme={theme}>
      {STAGE === 'UAT' && (
        <EnvironmentBanner
          env="test"
          message={t('environmentBanner.content')}
          icon={<WarningAmberIcon fontSize="small" />}
        />
      )}
      <React.Suspense fallback={<FirstLoadingSpinner />}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <RouterProvider />
          <LoadingOverlay />
          <ToastNotification />
          <MaintenanceBanner />
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
