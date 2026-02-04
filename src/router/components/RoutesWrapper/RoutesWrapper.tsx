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
import z from 'zod'

export const AllowedLanguage = z.enum(['en', 'it'])

function EmptyWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

const _RoutesWrapper: React.FC = () => {
  const switchLang = useSwitchPathLang()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const language = AllowedLanguage.safeParse(searchParams.get('lang'))
    if (language.success) {
      switchLang(language.data)
    } else {
      console.warn('Language URL params is not valid')
    }
  }, [searchParams, switchLang])

  const { isPublic, routeKey } = useCurrentRoute()
  const {
    jwt,
    isSupport,
    currentRoles,
    isOrganizationAllowedToProduce,
    isOrganizationAllowedToDelegations,
  } = AuthHooks.useJwt()

  useScrollTopOnLocationChange()

  /**
   * If the route is public, we don't need to check the TOS or the user's authorization.
   */
  const _TOSGuard = !isPublic && !isSupport && jwt ? TOSGuard : EmptyWrapper
  const _AuthGuard = !isPublic && jwt ? AuthGuard : EmptyWrapper

  return (
    <>
      <Header jwt={jwt} isSupport={isSupport} />
      <Stack direction={'column'}>
        <_TOSGuard>
          <AppLayout hideSideNav={!!routes[routeKey].hideSideNav}>
            <ErrorBoundary key={routeKey} FallbackComponent={ErrorPage}>
              <React.Suspense fallback={<PageContainerSkeleton />}>
                <_AuthGuard
                  jwt={jwt}
                  isOrganizationAllowedToProduce={isOrganizationAllowedToProduce}
                  isOrganizationAllowedToDelegations={isOrganizationAllowedToDelegations}
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
