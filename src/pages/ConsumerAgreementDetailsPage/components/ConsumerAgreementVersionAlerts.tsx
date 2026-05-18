import React from 'react'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import type { AlertColor } from '@mui/material'
import { Alert, Button, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { formatDateString } from '@/utils/format.utils'
import { ArchivingDetailsDrawer } from './ArchivingDetailsDrawer'

type ConsumerAgreementVersionAlertsProps = {
  descriptor: CatalogEServiceDescriptor | undefined
}

type AlertSpec = {
  severity: AlertColor
  content: string
  showSeeDetailsAction?: boolean
}

export const ConsumerAgreementVersionAlerts: React.FC<ConsumerAgreementVersionAlertsProps> = ({
  descriptor,
}) => {
  const { t } = useTranslation('agreement', { keyPrefix: 'consumerRead.versionAlert' })
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  if (!descriptor) return null

  const scheduledDate = descriptor.archivingSchedule?.archivableOn
    ? formatDateString(descriptor.archivingSchedule.archivableOn)
    : ''
  const archivedDate = descriptor.archivedAt ? formatDateString(descriptor.archivedAt) : ''
  const scope = descriptor.archivingSchedule?.scope

  const alerts: AlertSpec[] = match({ state: descriptor.state, scope })
    .with({ state: 'DEPRECATED' }, () => [
      { severity: 'info' as const, content: t('deprecatedActive') },
    ])
    .with({ state: 'ARCHIVING', scope: 'DESCRIPTOR' }, () => [
      {
        severity: 'warning' as const,
        content: t('archivingDescriptor', { date: scheduledDate }),
      },
    ])
    .with({ state: 'ARCHIVING', scope: 'ESERVICE' }, () => [
      {
        severity: 'warning' as const,
        content: t('archivingEService', { date: scheduledDate }),
        showSeeDetailsAction: true,
      },
      { severity: 'info' as const, content: t('deprecatedActiveShort') },
    ])
    .with({ state: 'ARCHIVING_SUSPENDED', scope: 'DESCRIPTOR' }, () => [
      {
        severity: 'error' as const,
        content: t('archivingSuspendedDescriptor', { date: scheduledDate }),
      },
    ])
    .with({ state: 'ARCHIVING_SUSPENDED', scope: 'ESERVICE' }, () => [
      { severity: 'error' as const, content: t('suspendedLastNoNewVersion') },
      {
        severity: 'warning' as const,
        content: t('archivingEService', { date: scheduledDate }),
        showSeeDetailsAction: true,
      },
    ])
    .with({ state: 'SUSPENDED' }, () => [
      { severity: 'error' as const, content: t('suspendedLast') },
    ])
    .with({ state: 'ARCHIVED', scope: 'ESERVICE' }, () => [
      { severity: 'error' as const, content: t('archivedEService', { date: archivedDate }) },
    ])
    .with({ state: 'ARCHIVED' }, () => [
      { severity: 'error' as const, content: t('archivedDescriptor', { date: archivedDate }) },
    ])
    .otherwise(() => [])

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
                <Button color="inherit" size="small" onClick={() => setIsDrawerOpen(true)}>
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
