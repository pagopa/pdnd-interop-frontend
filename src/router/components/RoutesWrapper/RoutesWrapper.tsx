import React, { useEffect } from 'react'
import { Footer, Header } from '@/components/layout'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageContainerSkeleton } from '@/components/layout/containers'
import { Outlet, useSearchParams } from 'react-router-dom'
import useScrollTopOnLocationChange from '../../hooks/useScrollTopOnLocationChange'
import { Box } from '@mui/material'
import { AuthGuard } from './AuthGuard'
import { ErrorBoundary } from '../../../components/shared/ErrorBoundary'
import TOSAgreement from './TOSAgreement'
import { useTOSAgreement } from '../../hooks/useTOSAgreement'
import { ErrorPage } from '@/pages'
import { Dialog } from '@/components/dialogs'
import { routes, useCurrentRoute, useSwitchPathLang } from '@/router'
import { AuthHooks } from '@/api/auth'
import { Stack } from '@mui/system'
import { AllowedLanguage } from '@/router/routes'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'
import { isLocalIdentitySelectionEnabled } from '@/config/local-development'
import { LocalSessionGuard } from './LocalSessionGuard'

function EmptyWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

const _RoutesWrapper: React.FC = () => {
  const switchLang = useSwitchPathLang()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const langParam = searchParams.get('lang')
    if (langParam !== null) {
      const language = AllowedLanguage.safeParse(langParam)
      if (language.success) {
        switchLang(language.data)
      } else {
        console.warn(`Language URL param is not valid: "${langParam}"`)
      }
    }
  }, [searchParams, switchLang])

  const { isPublic, routeKey } = useCurrentRoute()
  const { jwt, isSupport, currentRoles, isOrganizationAllowedToProduce } = AuthHooks.useJwt()

  useScrollTopOnLocationChange()

  /**
   * If the route is public, we don't need to check the TOS or the user's authorization.
   */
  const _TOSGuard = !isPublic && !isSupport && jwt ? TOSGuard : EmptyWrapper
  const _AuthGuard = !isPublic && jwt ? AuthGuard : EmptyWrapper

  return (
    <>
      <Header jwt={jwt} isSupport={isSupport} />
      <SupportActionGuardProvider isSupport={isSupport}>
        <Stack direction={'column'}>
          <_TOSGuard>
            <AppLayout hideSideNav={!!routes[routeKey].hideSideNav}>
              <ErrorBoundary key={routeKey} FallbackComponent={ErrorPage}>
                <React.Suspense fallback={<PageContainerSkeleton />}>
                  <_AuthGuard
                    jwt={jwt}
                    isOrganizationAllowedToProduce={isOrganizationAllowedToProduce}
                    isSupport={isSupport}
                    currentRoles={currentRoles}
                  >
                    <Outlet />
                  </_AuthGuard>
                </React.Suspense>
              </ErrorBoundary>
            </AppLayout>
          </_TOSGuard>
          <Footer jwt={jwt} />
          <Dialog />
        </Stack>
      </SupportActionGuardProvider>
    </>
  )
}

const TOSGuard = ({ children }: { children: React.ReactNode }) => {
  const { isTOSAccepted, handleAcceptTOS } = useTOSAgreement()

  if (!isTOSAccepted) {
    return <TOSAgreement onAcceptAgreement={handleAcceptTOS} />
  }

  return children
}

const RoutesWrapper: React.FC = () => {
  const SessionGuard = isLocalIdentitySelectionEnabled ? LocalSessionGuard : EmptyWrapper
  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <Box sx={{ p: 8 }}>
          <ErrorPage {...props} />
        </Box>
      )}
    >
      <SessionGuard>
        <_RoutesWrapper />
      </SessionGuard>
    </ErrorBoundary>
  )
}

export default RoutesWrapper
