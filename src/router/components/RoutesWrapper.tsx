import { Dialog } from '@/components/dialogs'
import { Footer, Header } from '@/components/layout'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageContainerSkeleton } from '@/components/layout/containers'
import { AuthContextProvider, DialogContextProvider, useDialog } from '@/contexts'
import { NotAuthorizedError } from '@/utils/errors.utils'
import React from 'react'
import { Outlet } from 'react-router-dom'
import useCurrentRoute from '../hooks/useCurrentRoute'
import useDetectLangFromPath from '../hooks/useDetectLangFromPath'
import useScrollTopOnLocationChange from '../hooks/useScrollTopOnLocationChange'
import { useTOSAgreement } from '../hooks/useTOSAgreement'
import TOSAgreement from './TOSAgreement'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorPage } from '@/pages'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Box } from '@mui/material'

const OutletWrapper: React.FC = () => {
  const { dialog } = useDialog()
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
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary onReset={reset} FallbackComponent={ErrorPage}>
                  <React.Suspense fallback={<PageContainerSkeleton />}>
                    <AuthGuard>
                      <Outlet />
                    </AuthGuard>
                  </React.Suspense>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          </AppLayout>
        )}
      </Box>

      <Footer />
      {dialog && <Dialog {...dialog} />}
    </>
  )
}

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isUserAuthorized } = useCurrentRoute()

  if (!isUserAuthorized) {
    throw new NotAuthorizedError()
  }

  return <>{children}</>
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
