import React from 'react'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { Alert, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getEServiceDescriptorAlertSpec } from '@/utils/eservice.utils'

type ConsumerEServiceDetailsAlertsProps = {
  descriptor: CatalogEServiceDescriptor | undefined
}

export const ConsumerEServiceDetailsAlerts: React.FC<ConsumerEServiceDetailsAlertsProps> = ({
  descriptor,
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

  const isAsyncExchange = descriptor.eservice.asyncExchange === true
  const isMissingProducerKeychain =
    isAsyncExchange && descriptor.eservice.hasProducerKeychain === false
  const isMissingProducerKeychainKeys =
    isAsyncExchange &&
    descriptor.eservice.hasProducerKeychain === true &&
    descriptor.eservice.hasProducerKeychainKeys === false

  if (!alert && !isMissingProducerKeychain && !isMissingProducerKeychainKeys) return null

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {alert && <Alert severity={alert.severity}>{alert.content}</Alert>}
      {isMissingProducerKeychain && (
        <Alert severity="warning">{t('missingProducerKeychain')}</Alert>
      )}
      {isMissingProducerKeychainKeys && (
        <Alert severity="warning">{t('missingProducerKeychainKeys')}</Alert>
      )}
    </Stack>
  )
}
