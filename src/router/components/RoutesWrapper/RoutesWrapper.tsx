import React from 'react'
import { Footer, Header } from '@/components/layout'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageContainerSkeleton } from '@/components/layout/containers'
import { Outlet } from 'react-router-dom'
import useCurrentRoute from '../../hooks/useCurrentRoute'
import useSyncLangWithRoute from '../../hooks/useSyncLangWithRoute'
import useScrollTopOnLocationChange from '../../hooks/useScrollTopOnLocationChange'
import { Box } from '@mui/material'
import { AuthGuard } from './AuthGuard'
import { ErrorBoundary } from './ErrorBoundary'
import TOSAgreement from './TOSAgreement'
import { useTOSAgreement } from '../../hooks/useTOSAgreement'
import { Dialog } from '@/components/dialogs'
import { useLoginAttempt } from '@/hooks/useLoginAttempt'

const RoutesWrapper: React.FC = () => {
  useLoginAttempt()
  useSyncLangWithRoute()
  useScrollTopOnLocationChange()

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

      <Dialog />
    </>
  )
}

export default RoutesWrapper
