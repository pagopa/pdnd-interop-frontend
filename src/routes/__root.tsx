import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, ThemeProvider } from '@mui/material'
import { Footer, Header, LoadingOverlay, ToastNotification } from '@/components/layout'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { theme } from '@pagopa/interop-fe-commons'
import { EnvironmentBanner as MuiItaliaEnvironmentBanner } from '@pagopa/mui-italia'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'

import { FirstLoadingSpinner } from '@/components/shared/FirstLoadingSpinner'
import { MaintenanceBanner } from '@/components/shared/MaintenanceBanner'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useSuspenseQuery, type QueryClient } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { STAGE } from '@/config/env'
import { useTranslation } from 'react-i18next'
import { Dialog } from '@/components/dialogs'
import { jwtQueryOptions } from '@/api/auth'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(jwtQueryOptions()),
  component: RootComponent,
  pendingComponent: FirstLoadingSpinner,
  wrapInSuspense: true,
})

function RootComponent() {
  const {
    data: { jwt, isSupport },
  } = useSuspenseQuery(jwtQueryOptions())

  return (
    <ThemeProvider theme={theme}>
      <EnvironmentBanner />
      <Header jwt={jwt} isSupport={isSupport} />
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer jwt={jwt} />
      <CssBaseline />
      <LoadingOverlay />
      <ToastNotification />
      <MaintenanceBanner />
      <Dialog />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools position="bottom-right" />
    </ThemeProvider>
  )
}

function EnvironmentBanner() {
  const { t } = useTranslation('shared-components')

  return match(STAGE)
    .with('UAT', () => (
      <MuiItaliaEnvironmentBanner
        bgColor="warning"
        message={t('environmentBanner.content.uat')}
        icon={<WarningAmberIcon fontSize="small" />}
      />
    ))
    .with('ATT', () => (
      <MuiItaliaEnvironmentBanner
        bgColor="info"
        message={t('environmentBanner.content.att')}
        icon={<PrivacyTipIcon fontSize="small" />}
      />
    ))
    .otherwise(() => null)
}
