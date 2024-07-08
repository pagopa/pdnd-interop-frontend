import React from 'react'
import { OneTrustNoticesMutations, getUserConsentQueryOptions } from '@/api/one-trust-notices'
import type { JwtUser } from '@/types/party.types'
import { useSuspenseQuery } from '@tanstack/react-query'

export function useTOSAgreement(jwt: JwtUser | undefined, isSupport: boolean) {
  const { mutateAsync: acceptNotice } = OneTrustNoticesMutations.useAcceptPrivacyNotice()

  const { data: userTOSConsent } = useSuspenseQuery(getUserConsentQueryOptions('TOS'))
  const { data: userPPConsent } = useSuspenseQuery(getUserConsentQueryOptions('PP'))

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
