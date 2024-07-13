import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Box } from '@mui/material'
import { Footer, Header, LoadingOverlay, ToastNotification } from '@/components/layout'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { EnvironmentBanner as MuiItaliaEnvironmentBanner } from '@pagopa/mui-italia'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'

import { FirstLoadingSpinner } from '@/components/shared/FirstLoadingSpinner'
import { MaintenanceBanner } from '@/components/shared/MaintenanceBanner'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { type QueryClient } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { STAGE } from '@/config/env'
import { useTranslation } from 'react-i18next'
import { Dialog } from '@/components/dialogs'
import { authenticateUser, type AuthContext } from '@/stores'

export type RouterContext = {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  loader: authenticateUser,
  component: React.memo(RootComponent),
  pendingComponent: FirstLoadingSpinner,
  wrapInSuspense: true,
  staticData: {
    authLevels: ['admin', 'api', 'security', 'support'],
    routeKey: 'ROOT',
  },
})

function RootComponent() {
  return (
    <>
      <EnvironmentBanner />
      <Header />
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
      <CssBaseline />
      <LoadingOverlay />
      <ToastNotification />
      <MaintenanceBanner />
      <Dialog />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools position="bottom-right" />
    </>
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
