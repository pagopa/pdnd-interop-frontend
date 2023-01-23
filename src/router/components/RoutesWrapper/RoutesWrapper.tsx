import { Footer, Header } from '@/components/layout'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageContainerSkeleton } from '@/components/layout/containers'
import { AuthContextProvider, DialogContextProvider } from '@/contexts'
import React from 'react'
import { Outlet } from 'react-router-dom'
import useCurrentRoute from '../../hooks/useCurrentRoute'
import useSyncLangWithRoute from '../../hooks/useSyncLangWithRoute'
import useScrollTopOnLocationChange from '../../hooks/useScrollTopOnLocationChange'
import { Box } from '@mui/material'
import { AuthGuard } from './AuthGuard'
import { ErrorBoundary } from '../../../components/shared/ErrorBoundary'
import TOSAgreement from './TOSAgreement'
import { useTOSAgreement } from '../../hooks/useTOSAgreement'
import { ErrorPage } from '@/pages'

const RoutesWrapper: React.FC = () => {
  const { isTOSAccepted, acceptTOS } = useTOSAgreement()
  const { isPublic, routeKey } = useCurrentRoute()
  useSyncLangWithRoute()
  useScrollTopOnLocationChange()

  return (
    // AuthContextProvider and DialogContextProvider use internally routes related functions
    // they need to be inside the router context.
    <ErrorBoundary
      FallbackComponent={(props) => (
        <Box sx={{ p: 8 }}>
          <ErrorPage {...props} />
        </Box>
      )}
    >
      <AuthContextProvider>
        <DialogContextProvider>
          <Header />
          <Box sx={{ flex: 1 }}>
            {!isTOSAccepted && !isPublic ? (
              <TOSAgreement onAcceptAgreement={acceptTOS} />
            ) : (
              <AppLayout hideSideNav={isPublic}>
                <ErrorBoundary key={routeKey} FallbackComponent={ErrorPage}>
                  <React.Suspense fallback={<PageContainerSkeleton />}>
                    <AuthGuard>
                      <Outlet />
                    </AuthGuard>
                  </React.Suspense>
                </ErrorBoundary>
              </AppLayout>
            )}
          </Box>
          <Footer />
        </DialogContextProvider>
      </AuthContextProvider>
    </ErrorBoundary>
  )
}

export default RoutesWrapper
