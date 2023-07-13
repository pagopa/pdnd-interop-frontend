import React from 'react'
import { OneTrustNoticesMutations, OneTrustNoticesQueries } from '@/api/one-trust-notices'

export function useTOSAgreement() {
  const { mutateAsync: acceptNotice } = OneTrustNoticesMutations.useAcceptPrivacyNotice()

  const { data: userTOSConsent } = OneTrustNoticesQueries.useGetUserConsent('TOS')
  const { data: userPPConsent } = OneTrustNoticesQueries.useGetUserConsent('PP')

  const hasAcceptedTOS = userTOSConsent?.firstAccept && userTOSConsent?.isUpdated
  const hasAcceptedPP = userPPConsent?.firstAccept && userPPConsent?.isUpdated

  const isTOSAccepted = !!(hasAcceptedTOS && hasAcceptedPP)

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
