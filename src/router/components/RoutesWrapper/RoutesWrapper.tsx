import { Footer, Header } from '@/components/layout'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageContainerSkeleton } from '@/components/layout/containers'
import { AuthContextProvider, DialogContextProvider } from '@/contexts'
import React from 'react'
import { Outlet } from 'react-router-dom'
import useCurrentRoute from '../../hooks/useCurrentRoute'
import useDetectLangFromPath from '../../hooks/useDetectLangFromPath'
import useScrollTopOnLocationChange from '../../hooks/useScrollTopOnLocationChange'
import { Box } from '@mui/material'
import { AuthGuard } from './AuthGuard'
import { ErrorBoundary } from './ErrorBoundary'
import TOSAgreement from './TOSAgreement'
import { useTOSAgreement } from '../../hooks/useTOSAgreement'

const OutletWrapper: React.FC = () => {
  const { isTOSAccepted, acceptTOS } = useTOSAgreement()
  const { isPublic } = useCurrentRoute()

  return (
    <>
      <Header />
      <Box sx={{ flex: 1 }}>
        {!isTOSAccepted && !isPublic ? (
          <TOSAgreement onAcceptAgreement={acceptTOS} />
        ) : (
          <AppLayout hideSideNav={isPublic}>
            <ErrorBoundary>
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
    </>
  )
}

const RoutesWrapper: React.FC = () => {
  useDetectLangFromPath()
  useScrollTopOnLocationChange()

  return (
    <AuthContextProvider>
      <DialogContextProvider>
        <OutletWrapper />
      </DialogContextProvider>
    </AuthContextProvider>
  )
}

export default RoutesWrapper
