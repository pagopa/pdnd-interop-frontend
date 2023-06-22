import React from 'react'
import { OneTrustNoticesMutations, OneTrustNoticesQueries } from '@/api/one-trust-notices'

export function useTOSAgreement() {
  const { mutate } = OneTrustNoticesMutations.useAcceptPrivacyNotice()

  const { data: userTOSConsent } = OneTrustNoticesQueries.useGetUserConsent('TOS')
  const { data: userPPConsent } = OneTrustNoticesQueries.useGetUserConsent('PP')

  const hasAcceptedTOS = !userTOSConsent?.firstAccept && userTOSConsent?.isUpdated
  const hasAcceptedPP = !userPPConsent?.firstAccept && userPPConsent?.isUpdated

  const hasAcceptedAll = !!(hasAcceptedTOS && hasAcceptedPP)

  console.log(userTOSConsent, userPPConsent, hasAcceptedAll)

  const handleAcceptTOS = React.useCallback(() => {
    if (hasAcceptedAll) return
    if (!userTOSConsent?.latestVersionId || !userPPConsent?.latestVersionId) return

    mutate({ consentType: 'TOS', latestVersionId: userTOSConsent.latestVersionId })
    mutate({ consentType: 'PP', latestVersionId: userPPConsent.latestVersionId })
  }, [hasAcceptedAll, userTOSConsent?.latestVersionId, userPPConsent?.latestVersionId, mutate])

  return { isTOSAccepted: hasAcceptedAll, handleAcceptTOS }
}
