import React from 'react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Alert, Button, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getEServiceDescriptorAlertSpec } from '@/utils/eservice.utils'

type ProviderEServiceDetailsAlertsProps = {
  descriptor: ProducerEServiceDescriptor | undefined
  onViewKeychains?: VoidFunction
}

export const ProviderEServiceDetailsAlerts: React.FC<ProviderEServiceDetailsAlertsProps> = ({
  descriptor,
  onViewKeychains,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.alert' })

  if (!descriptor) return null

  const alert = getEServiceDescriptorAlertSpec({
    state: descriptor.state,
    scope: descriptor.archivingSchedule?.scope,
    archivableOn: descriptor.archivingSchedule?.archivableOn,
    archivedAt: descriptor.archivedAt,
    t,
  })

  const shouldShowMissingKeychainAlert =
    descriptor.eservice.asyncExchange && !descriptor.eservice.hasProducerKeychain
  const shouldShowMissingKeychainKeysAlert =
    descriptor.eservice.asyncExchange &&
    descriptor.eservice.hasProducerKeychain &&
    !descriptor.eservice.hasProducerKeychainKeys
  const viewKeychainsAction = onViewKeychains ? (
    <Button color="primary" size="small" onClick={onViewKeychains}>
      {t('viewProducerKeychains')}
    </Button>
  ) : undefined

  if (!alert && !shouldShowMissingKeychainAlert && !shouldShowMissingKeychainKeysAlert) return null

  return (
    <Stack spacing={2}>
      {alert && <Alert severity={alert.severity}>{alert.content}</Alert>}
      {shouldShowMissingKeychainAlert && (
        <Alert severity="warning" action={viewKeychainsAction}>
          {t('providerMissingProducerKeychain')}
        </Alert>
      )}
      {shouldShowMissingKeychainKeysAlert && (
        <Alert severity="warning" action={viewKeychainsAction}>
          {t('providerMissingProducerKeychainKeys')}
        </Alert>
      )}
    </Stack>
  )
}
