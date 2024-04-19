import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'
import { RouterProvider } from '@/router'
import { LoadingOverlay, ToastNotification } from '@/components/layout'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { theme } from '@pagopa/interop-fe-commons'
import { EnvironmentBanner } from '@pagopa/mui-italia'
import { STAGE } from './config/env'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import { useTranslation } from 'react-i18next'
import { MaintenanceBanner } from './components/shared/MaintenanceBanner'
import { AuthQueryKeys } from './api/auth'
import AuthServices from './api/auth/auth.services'
import { FirstLoadingSpinner } from './components/shared/FirstLoadingSpinner'
import { queryClient } from './config/query-client'
import type { EnvironmentBannerProps } from '@pagopa/mui-italia'
import { useTracking } from './hooks/useTracking'

queryClient.prefetchQuery([AuthQueryKeys.GetSessionToken], AuthServices.getSessionToken)

function App() {
  const { t } = useTranslation('shared-components')

  let envBannerProps: EnvironmentBannerProps | undefined = undefined

  // Setup MixPanel tracking
  useTracking()

  if (STAGE === 'UAT') {
    envBannerProps = {
      bgColor: 'warning',
      message: t('environmentBanner.content.uat'),
      icon: <WarningAmberIcon fontSize="small" />,
    }
  }

  if (STAGE === 'ATT') {
    envBannerProps = {
      bgColor: 'info',
      message: t('environmentBanner.content.att'),
      icon: <PrivacyTipIcon fontSize="small" />,
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {envBannerProps && <EnvironmentBanner {...envBannerProps} />}
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

export default App
