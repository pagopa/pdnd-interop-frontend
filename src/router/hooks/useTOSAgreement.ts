import React from 'react'
import { OneTrustNoticesMutations, OneTrustNoticesQueries } from '@/api/one-trust-notices'

export function useTOSAgreement() {
  const { mutateAsync } = OneTrustNoticesMutations.useAcceptPrivacyNotice()

  const { data: userTOSConsent } = OneTrustNoticesQueries.useGetUserConsent('TOS')
  const { data: userPPConsent } = OneTrustNoticesQueries.useGetUserConsent('PP')

  const hasAcceptedTOS = userTOSConsent?.firstAccept && userTOSConsent?.isUpdated
  const hasAcceptedPP = userPPConsent?.firstAccept && userPPConsent?.isUpdated

  const isTOSAccepted = !!(hasAcceptedTOS && hasAcceptedPP)

  const handleAcceptTOS = React.useCallback(() => {
    if (isTOSAccepted) return
    if (!userTOSConsent?.latestVersionId || !userPPConsent?.latestVersionId) return

    Promise.all([
      mutateAsync({ consentType: 'TOS', latestVersionId: userTOSConsent.latestVersionId }),
      mutateAsync({ consentType: 'PP', latestVersionId: userPPConsent.latestVersionId }),
    ])
  }, [isTOSAccepted, userTOSConsent?.latestVersionId, userPPConsent?.latestVersionId, mutateAsync])

  return { isTOSAccepted, handleAcceptTOS }
}
