import React from 'react'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { checkIfAlreadySubscribed, checkIfhasAlreadyAgreementDraft } from '@/utils/agreement.utils'
import { Alert, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

type ConsumerEServiceDetailsAlertsProps = {
  descriptor: CatalogEServiceDescriptor | undefined
}

export const ConsumerEServiceDetailsAlerts: React.FC<ConsumerEServiceDetailsAlertsProps> = ({
  descriptor,
}) => {
  const { t } = useTranslation('eservice')

  if (!descriptor) return null

  const isMine = Boolean(descriptor?.eservice.isMine)
  const isSubscribed = checkIfAlreadySubscribed(descriptor?.eservice)
  const hasAgreementDraft = checkIfhasAlreadyAgreementDraft(descriptor?.eservice)

  // Only show missing certified attributes alert when...
  const shouldShowMissingCertifiedAttributesAlert =
    // ...the e-service is not owned by the active party...
    !isMine &&
    // ... the party doesn't own all the certified attributes required...
    !descriptor?.eservice.hasCertifiedAttributes &&
    // ... the e-service's latest active descriptor is the actual descriptor the user is viewing...
    descriptor?.eservice.activeDescriptor?.id === descriptor?.id &&
    /// ... and it is not archived.
    descriptor?.state !== 'ARCHIVED'

  return (
    <Stack spacing={2}>
      {isMine && <Alert severity="info">{t('read.alert.youAreTheProvider')}</Alert>}
      {shouldShowMissingCertifiedAttributesAlert && (
        <Alert severity="info">{t('read.alert.missingCertifiedAttributes')}</Alert>
      )}
      {isSubscribed && <Alert severity="info">{t('read.alert.alreadySubscribed')}</Alert>}
      {hasAgreementDraft && <Alert severity="info">{t('read.alert.hasAgreementDraft')}</Alert>}
    </Stack>
  )
}
