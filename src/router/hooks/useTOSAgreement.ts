import React from 'react'
import { OneTrustNoticesMutations, OneTrustNoticesQueries } from '@/api/one-trust-notices'
import type { JwtUser } from '@/types/party.types'
import { useQuery } from '@tanstack/react-query'

export function useTOSAgreement(jwt: JwtUser | undefined, isSupport: boolean) {
  const { mutateAsync: acceptNotice } = OneTrustNoticesMutations.useAcceptPrivacyNotice()

  /**
   * If we are in support mode, we don't need to check if the user has accepted the TOS.
   */
  const { data: userTOSConsent } = useQuery({
    ...OneTrustNoticesQueries.getUserConsent('TOS'),
    enabled: Boolean(jwt && !isSupport),
  })

  const { data: userPPConsent } = useQuery({
    ...OneTrustNoticesQueries.getUserConsent('PP'),
    enabled: Boolean(jwt && !isSupport),
  })

  const hasAcceptedTOS = userTOSConsent?.firstAccept && userTOSConsent?.isUpdated
  const hasAcceptedPP = userPPConsent?.firstAccept && userPPConsent?.isUpdated

  const isTOSAccepted = isSupport || !!(hasAcceptedTOS && hasAcceptedPP)

  const handleAcceptTOS = React.useCallback(() => {
    if (isTOSAccepted) return
    if (!userTOSConsent?.latestVersionId || !userPPConsent?.latestVersionId) return

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
  }, [
    isTOSAccepted,
    userTOSConsent?.latestVersionId,
    userPPConsent?.latestVersionId,
    acceptNotice,
    hasAcceptedTOS,
    hasAcceptedPP,
  ])

  return { isTOSAccepted, handleAcceptTOS }
}
