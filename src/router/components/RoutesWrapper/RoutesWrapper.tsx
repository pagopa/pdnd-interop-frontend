import React from 'react'
import { Drawer, Footer, Header } from '@/components/layout'
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
import { useLoginAttempt } from '@/hooks/useLoginAttempt'
import { useCurrentRoute } from '@/router'

const _RoutesWrapper: React.FC = () => {
  const { isTOSAccepted, handleAcceptTOS } = useTOSAgreement()
  const { isPublic, routeKey } = useCurrentRoute()
  useLoginAttempt()
  useScrollTopOnLocationChange()

  return (
    <>
      <Header />
      <Box sx={{ flex: 1 }}>
        {!isTOSAccepted && !isPublic ? (
          <TOSAgreement onAcceptAgreement={handleAcceptTOS} />
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
      <Dialog />
      <Drawer />
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
