import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getBlacklistQueryOptions, jwtQueryOptions } from '@/api/auth'
import { AuthenticationError, UnauthorizedError } from '@/utils/errors.utils'
import { OneTrustNoticesMutations, getUserConsentQueryOptions } from '@/api/one-trust-notices'
import { TOSAgreement } from '@pagopa/mui-italia'
import { Trans, useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Outlet } from '@tanstack/react-router'
import { useCurrentRoute } from '@/router'
import { useIsAuthorizedToAccessRoute } from '@/hooks/useIsAuthorizedToAccessRoute'
import { AppLayout, AppLayoutSkeleton } from '@/components/layout/AppLayout'
import { STAGE } from '@/config/env'
import { RouterLink } from '@/components/shared/RouterLink'

export const Route = createFileRoute('/_private-routes-wrapper')({
  loader: async ({ context: { queryClient } }) => {
    const { jwt } = await queryClient.ensureQueryData(jwtQueryOptions())

    if (!jwt) {
      throw new AuthenticationError()
    }

    queryClient.ensureQueryData(getUserConsentQueryOptions('TOS'))
    queryClient.ensureQueryData(getUserConsentQueryOptions('PP'))
    if (STAGE === 'PROD') {
      queryClient.ensureQueryData(getBlacklistQueryOptions())
    }
  },
  component: React.memo(PrivateRoutesWrapper),
  pendingComponent: PrivateRoutesWrapperSkeleton,
  wrapInSuspense: true,
  staticData: {
    routeKey: 'PRIVATE_ROUTES_WRAPPER',
    authLevels: ['admin', 'api', 'security', 'support'],
  },
})

function PrivateRoutesWrapper() {
  const shouldHideSidenav = Boolean(useCurrentRoute().hideSideNav)

  const _BlackListGuard = STAGE === 'PROD' ? BlackListGuard : React.Fragment

  return (
    <TOSGuard>
      <AppLayout hideSideNav={shouldHideSidenav}>
        <AuthorizationGuard>
          <_BlackListGuard>
            <Outlet />
          </_BlackListGuard>
        </AuthorizationGuard>
      </AppLayout>
    </TOSGuard>
  )
}

function PrivateRoutesWrapperSkeleton() {
  const shouldHideSidenav = Boolean(useCurrentRoute().hideSideNav)
  return <AppLayoutSkeleton hideSideNav={shouldHideSidenav} />
}

function TOSGuard({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('pagopa', { keyPrefix: 'tos' })
  const { mutateAsync: acceptNotice } = OneTrustNoticesMutations.useAcceptPrivacyNotice()

  const {
    data: { isSupport },
  } = useSuspenseQuery(jwtQueryOptions())

  const { data: userTOSConsent } = useSuspenseQuery(getUserConsentQueryOptions('TOS'))
  const { data: userPPConsent } = useSuspenseQuery(getUserConsentQueryOptions('PP'))

  const hasAcceptedTOS = userTOSConsent.firstAccept && userTOSConsent.isUpdated
  const hasAcceptedPP = userPPConsent.firstAccept && userPPConsent.isUpdated

  const isTOSAccepted = isSupport || !!(hasAcceptedTOS && hasAcceptedPP)

  function handleAcceptTOS() {
    const acceptPromises: Promise<unknown>[] = []

    if (!hasAcceptedTOS) {
      acceptPromises.push(
        acceptNotice({ consentType: 'TOS', latestVersionId: userTOSConsent.latestVersionId })
      )
    }

    if (!hasAcceptedPP) {
      acceptPromises.push(
        acceptNotice({ consentType: 'PP', latestVersionId: userPPConsent.latestVersionId })
      )
    }

    Promise.all(acceptPromises)
  }

  if (!isTOSAccepted) {
    return (
      <TOSAgreement
        sx={{ height: '100%' }}
        productName={t('title')}
        description={
          <Trans
            components={{
              1: <RouterLink to="/termini-di-servizio" underline="hover" />,
              2: <RouterLink to="/privacy-policy" underline="hover" />,
            }}
          >
            {t('description')}
          </Trans>
        }
        onConfirm={handleAcceptTOS}
        confirmBtnLabel={t('confirmBtnLabel')}
      />
    )
  }

  return children
}

function BlackListGuard({ children }: { children: React.ReactNode }) {
  const { data: blacklist } = useSuspenseQuery(getBlacklistQueryOptions())
  const {
    data: { jwt },
  } = useSuspenseQuery(jwtQueryOptions())
  const isInBlacklist = jwt?.organizationId && blacklist.includes(jwt.organizationId)

  if (isInBlacklist) {
    throw new UnauthorizedError()
  }

  return children
}

function AuthorizationGuard({ children }: { children: React.ReactNode }) {
  const currentRouteId = useCurrentRoute().routeId

  const isAuthorizedToAccessRoute = useIsAuthorizedToAccessRoute({ routeId: currentRouteId })

  if (!isAuthorizedToAccessRoute) {
    throw new UnauthorizedError()
  }

  return children
}
