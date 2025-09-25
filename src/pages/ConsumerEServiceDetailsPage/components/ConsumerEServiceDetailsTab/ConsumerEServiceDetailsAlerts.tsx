import React from 'react'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { Alert, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

type ConsumerEServiceDetailsAlertsProps = {
  descriptor: CatalogEServiceDescriptor | undefined
}

export const ConsumerEServiceDetailsAlerts: React.FC<ConsumerEServiceDetailsAlertsProps> = ({
  descriptor,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.alert' })

  if (!descriptor) return null

  const isSuspended = descriptor?.state === 'SUSPENDED'
  const isDeprecated = descriptor?.state === 'DEPRECATED'

  return (
    <Stack spacing={2}>
      {isSuspended && <Alert severity="error">{t('suspended')}</Alert>}
      {isDeprecated && <Alert severity="info">{t('deprecated')}</Alert>}
    </Stack>
  )
}
