import React from 'react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Alert, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getEServiceDescriptorAlertSpec } from '@/utils/eservice.utils'

type ProviderEServiceDetailsAlertsProps = {
  descriptor: ProducerEServiceDescriptor | undefined
}

export const ProviderEServiceDetailsAlerts: React.FC<ProviderEServiceDetailsAlertsProps> = ({
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

  if (!alert) return null

  return (
    <Stack spacing={2}>
      <Alert severity={alert.severity}>{alert.content}</Alert>
    </Stack>
  )
}
