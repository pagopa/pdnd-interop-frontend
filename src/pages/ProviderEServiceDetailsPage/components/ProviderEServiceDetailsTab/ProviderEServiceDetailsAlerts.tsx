import React from 'react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Alert, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

type ProviderEServiceDetailsAlertsProps = {
  descriptor: ProducerEServiceDescriptor | undefined
}

export const ProviderEServiceDetailsAlerts: React.FC<ProviderEServiceDetailsAlertsProps> = ({
  descriptor,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.alert' })

  if (!descriptor) return null

  const isSuspended = descriptor?.state === 'SUSPENDED'
  const isDeprecated = descriptor?.state === 'DEPRECATED'
  const shouldShowMissingKeychainAlert =
    descriptor.eservice.asyncExchange && !descriptor.eservice.hasProducerKeychain
  const shouldShowMissingKeychainKeysAlert =
    descriptor.eservice.asyncExchange &&
    descriptor.eservice.hasProducerKeychain &&
    !descriptor.eservice.hasProducerKeychainKeys

  return (
    <Stack spacing={2}>
      {isSuspended && <Alert severity="error">{t('suspended')}</Alert>}
      {isDeprecated && <Alert severity="info">{t('deprecated')}</Alert>}
      {shouldShowMissingKeychainAlert && (
        <Alert severity="warning">{t('providerMissingProducerKeychain')}</Alert>
      )}
      {shouldShowMissingKeychainKeysAlert && (
        <Alert severity="warning">{t('providerMissingProducerKeychainKeys')}</Alert>
      )}
    </Stack>
  )
}
