import React from 'react'
import { Footer, Header } from '@/components/layout'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageContainerSkeleton } from '@/components/layout/containers'
import { Outlet } from 'react-router-dom'
import useScrollTopOnLocationChange from '../../hooks/useScrollTopOnLocationChange'
import { Box } from '@mui/material'
import { AuthorizationGuard } from './AuthorizationGuard'
import { ErrorBoundary } from '../../../components/shared/ErrorBoundary'
import { ErrorPage, LogoutPage } from '@/pages'
import { Dialog } from '@/components/dialogs'
import { routes, useCurrentRoute } from '@/router'
import { AuthHooks } from '@/api/auth'
import { FirstLoadingSpinner } from '@/components/shared/FirstLoadingSpinner'
import { TOSAgreementGuard } from './TOSAgreementGuard'
import { hasSessionExpired } from '@/utils/common.utils'
import type { JwtUser } from '@/types/party.types'

const _RoutesWrapper: React.FC = () => {
  const { isPublic, routeKey } = useCurrentRoute()

  const { jwt, isSupport, currentRoles, isLoadingSession, isOrganizationAllowedToProduce } =
    AuthHooks.useJwt()

  useScrollTopOnLocationChange()

  if (isLoadingSession && !isPublic) return <FirstLoadingSpinner />

  return (
    <>
      <Header jwt={jwt} isSupport={isSupport} />
      <Box sx={{ flex: 1 }}>
        <AuthenticationGuard jwt={jwt} isPublic={isPublic}>
          <TOSAgreementGuard jwt={jwt} isPublic={isPublic} isSupport={isSupport}>
            <AppLayout hideSideNav={!!routes[routeKey].hideSideNav}>
              <ErrorBoundary key={routeKey} FallbackComponent={ErrorPage}>
                <React.Suspense fallback={<PageContainerSkeleton />}>
                  <AuthorizationGuard
                    jwt={jwt}
                    isOrganizationAllowedToProduce={isOrganizationAllowedToProduce}
                    isSupport={isSupport}
                    currentRoles={currentRoles}
                  >
                    <Outlet />
                  </AuthorizationGuard>
                </React.Suspense>
              </ErrorBoundary>
            </AppLayout>
          </TOSAgreementGuard>
        </AuthenticationGuard>
      </Box>
      <Footer jwt={jwt} />
      <Dialog />
    </>
  )
}

const AuthenticationGuard: React.FC<{
  jwt: JwtUser | undefined
  isPublic: boolean
  children: React.ReactNode
}> = ({ jwt, isPublic, children }) => {
  if (isPublic) {
    return children
  }

  if (!jwt || hasSessionExpired(jwt?.exp)) {
    return <LogoutPage />
  }

  return children
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
