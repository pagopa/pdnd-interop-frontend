import React from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { getUserConsentQueryOptions, OneTrustNoticesMutations } from '@/api/one-trust-notices'
import { useSuspenseQuery } from '@tanstack/react-query'
import { jwtQueryOptions } from '@/api/auth'
import { Trans, useTranslation } from 'react-i18next'
import { TOSAgreement } from '@pagopa/mui-italia'
import { FirstLoadingSpinner } from '@/components/shared/FirstLoadingSpinner'

export const Route = createFileRoute('/_authentication-guard/_tos-guard')({
  component: TOSGuard,
  wrapInSuspense: true,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getUserConsentQueryOptions('TOS'))
    queryClient.ensureQueryData(getUserConsentQueryOptions('PP'))
  },
  pendingComponent: FirstLoadingSpinner,
})

function TOSGuard() {
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
              1: <></>,
              2: <></>,
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

  return <Outlet />
}
