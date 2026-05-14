import React from 'react'
import type { ArchivingSchedule, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Alert, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getEServiceDescriptorAlertSpec } from '@/utils/eservice.utils'

// TODO: rimuovere l'augmentation quando `archivingSchedule` sarà incluso in
// ProducerEServiceDescriptor (BE PR pagopa/interop-be-monorepo#3335).
type ProducerDescriptorWithArchivingSchedule = ProducerEServiceDescriptor & {
  archivingSchedule?: ArchivingSchedule
}

type ProviderEServiceDetailsAlertsProps = {
  descriptor: ProducerEServiceDescriptor | undefined
}

export const ProviderEServiceDetailsAlerts: React.FC<ProviderEServiceDetailsAlertsProps> = ({
  descriptor,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.alert' })

  if (!descriptor) return null

  const d = descriptor as ProducerDescriptorWithArchivingSchedule
  const alert = getEServiceDescriptorAlertSpec({
    state: d.state,
    scope: d.archivingSchedule?.scope,
    archivableOn: d.archivingSchedule?.archivableOn,
    archivedAt: d.archivedAt,
    t,
  })

  if (!alert) return null

  return (
    <Stack spacing={2}>
      <Alert severity={alert.severity}>{alert.content}</Alert>
    </Stack>
  )
}
