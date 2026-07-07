import React from 'react'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { Alert, Button, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getConsumerAgreementVersionAlertSpec } from '@/utils/agreement.utils'
import { ArchivingDetailsDrawer } from './ArchivingDetailsDrawer'

type ConsumerAgreementVersionAlertsProps = {
  descriptor: CatalogEServiceDescriptor | undefined
}

export const ConsumerAgreementVersionAlerts: React.FC<ConsumerAgreementVersionAlertsProps> = ({
  descriptor,
}) => {
  const { t } = useTranslation('agreement', { keyPrefix: 'consumerRead.versionAlert' })
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  if (!descriptor) return null

  const activeDescriptor = descriptor.eservice.activeDescriptor
  const isObsoleteDescriptor = Boolean(activeDescriptor && activeDescriptor.id !== descriptor.id)

  const alerts = getConsumerAgreementVersionAlertSpec({
    state: descriptor.state,
    scope: descriptor.archivingSchedule?.scope,
    archivableOn: descriptor.archivingSchedule?.archivableOn,
    archivedAt: descriptor.archivedAt,
    isObsoleteDescriptor,
    t,
  })

  if (alerts.length === 0) return null

  const hasDrawerAction = alerts.some((alert) => alert.showSeeDetailsAction)

  return (
    <>
      <Stack spacing={2} sx={{ mb: 3 }}>
        {alerts.map((alert, idx) => (
          <Alert
            key={idx}
            severity={alert.severity}
            action={
              alert.showSeeDetailsAction ? (
                <Button color="primary" size="small" onClick={() => setIsDrawerOpen(true)}>
                  {t('seeDetails')}
                </Button>
              ) : undefined
            }
          >
            {alert.content}
          </Alert>
        ))}
      </Stack>
      {hasDrawerAction && (
        <ArchivingDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          archivingReason={descriptor.eservice.archivingReason}
        />
      )}
    </>
  )
}
