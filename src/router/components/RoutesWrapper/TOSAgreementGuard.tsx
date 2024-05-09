import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TOSAgreement as PagoPATOSAgreement } from '@pagopa/mui-italia'
import { Link } from '@/router'
import { OneTrustNoticesMutations, OneTrustNoticesQueries } from '@/api/one-trust-notices'
import type { JwtUser } from '@/types/party.types'

type TOSAgreementGuardProps = {
  jwt: JwtUser | undefined
  isPublic: boolean
  isSupport: boolean
  children: React.ReactNode
}

export const TOSAgreementGuard: React.FC<TOSAgreementGuardProps> = ({
  jwt,
  isPublic,
  isSupport,
  children,
}) => {
  const { t } = useTranslation('pagopa', { keyPrefix: 'tos' })

  const { mutateAsync: acceptNotice } = OneTrustNoticesMutations.useAcceptPrivacyNotice()

  /**
   * If we are in support mode, we don't need to check if the user has accepted the TOS.
   */
  const { data: userTOSConsent } = OneTrustNoticesQueries.useGetUserConsent('TOS', {
    enabled: Boolean(jwt) && !isSupport,
  })

  const { data: userPPConsent } = OneTrustNoticesQueries.useGetUserConsent('PP', {
    enabled: Boolean(jwt) && !isSupport,
  })

  const hasAcceptedTOS = userTOSConsent?.firstAccept && userTOSConsent?.isUpdated
  const hasAcceptedPP = userPPConsent?.firstAccept && userPPConsent?.isUpdated

  const isTOSAccepted = !!(hasAcceptedTOS && hasAcceptedPP)

  const handleAcceptTOS = () => {
    if (isTOSAccepted) {
      throw new Error('User has already accepted TOS and PP, why are we here?')
    }

    if (!userTOSConsent?.latestVersionId) {
      throw new Error('Missing latest version id for TOS')
    }

    if (!userPPConsent?.latestVersionId) {
      throw new Error('Missing latest version id for PP')
    }

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

  if (jwt && !isTOSAccepted && !isPublic) {
    return (
      <PagoPATOSAgreement
        sx={{ height: '100%' }}
        productName={t('title')}
        description={
          <Trans
            components={{
              1: <Link to="TOS" underline="hover" />,
              2: <Link to="PRIVACY_POLICY" underline="hover" />,
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

  return <>{children}</>
}
