import React from 'react'
import { Footer, Header } from '@/components/layout'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageContainerSkeleton } from '@/components/layout/containers'
import { Outlet } from 'react-router-dom'
import useScrollTopOnLocationChange from '../../hooks/useScrollTopOnLocationChange'
import { Box } from '@mui/material'
import { AuthGuard } from './AuthGuard'
import { ErrorBoundary } from '../../../components/shared/ErrorBoundary'
import TOSAgreement from './TOSAgreement'
import { useTOSAgreement } from '../../hooks/useTOSAgreement'
import { ErrorPage } from '@/pages'
import { Dialog } from '@/components/dialogs'
import { routes, useCurrentRoute } from '@/router'
import { useCheckSessionExpired } from '@/router/hooks/useCheckSessionExpired'
import { AuthHooks } from '@/api/auth'
import { FirstLoadingSpinner } from '@/components/shared/FirstLoadingSpinner'

const _RoutesWrapper: React.FC = () => {
  const { isPublic, routeKey } = useCurrentRoute()

  const { jwt, isSupport, currentRoles, isLoadingSession, isOrganizationAllowedToProduce } =
    AuthHooks.useJwt()
  const { isTOSAccepted, handleAcceptTOS } = useTOSAgreement(jwt, isSupport)

  useScrollTopOnLocationChange()
  useCheckSessionExpired(jwt?.exp)

  if (isLoadingSession && !isPublic) return <FirstLoadingSpinner />

  return (
    <>
      <Header jwt={jwt} isSupport={isSupport} />
      <Box sx={{ flex: 1 }}>
        {!isTOSAccepted && !isPublic ? (
          <TOSAgreement onAcceptAgreement={handleAcceptTOS} />
        ) : (
          <AppLayout hideSideNav={!!routes[routeKey].hideSideNav}>
            <ErrorBoundary key={routeKey} FallbackComponent={ErrorPage}>
              <React.Suspense fallback={<PageContainerSkeleton />}>
                <AuthGuard
                  jwt={jwt}
                  isOrganizationAllowedToProduce={isOrganizationAllowedToProduce}
                  isSupport={isSupport}
                  currentRoles={currentRoles}
                >
                  <Outlet />
                </AuthGuard>
              </React.Suspense>
            </ErrorBoundary>
          </AppLayout>
        )}
      </Box>
      <Footer jwt={jwt} />
      <Dialog />
    </>
  )
}

const RoutesWrapper: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <Box sx={{ p: 8 }}>
          <ErrorPage {...props} />
        </Box>
      )}
    >
      <_RoutesWrapper />
    </ErrorBoundary>
  )
}

export default RoutesWrapper
