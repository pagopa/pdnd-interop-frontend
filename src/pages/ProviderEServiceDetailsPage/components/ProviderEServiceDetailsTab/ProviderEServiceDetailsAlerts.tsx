import React from 'react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Alert, Button, Stack, Typography } from '@mui/material'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import { useTranslation } from 'react-i18next'
import { formatDateStringNumeric } from '@/utils/format.utils'
import { Drawer } from '@/components/shared/Drawer'
import {
  getActiveDescriptor,
  getEServiceDescriptorAlertSpec,
  getLatestDelegatedDescriptorArchivingRequest,
  isDescriptorPendingArchiving,
} from '@/utils/eservice.utils'

type ProviderEServiceDetailsAlertsProps = {
  descriptor: ProducerEServiceDescriptor | undefined
  onViewKeychains?: VoidFunction
}

export const ProviderEServiceDetailsAlerts: React.FC<ProviderEServiceDetailsAlertsProps> = ({
  descriptor,
  onViewKeychains,
}) => {
  const [isRejectionReasonDrawerOpen, setIsRejectionReasonDrawerOpen] = React.useState(false)

  const { t } = useTranslation('eservice', { keyPrefix: 'read.alert' })

  if (!descriptor) return null

  const activeDescriptor = getActiveDescriptor(descriptor.eservice.descriptors)
  const isEServiceBeingArchived = isDescriptorPendingArchiving(activeDescriptor?.state)

  const alert = getEServiceDescriptorAlertSpec({
    state: descriptor.state,
    scope: descriptor.archivingSchedule?.scope,
    archivableOn: descriptor.archivingSchedule?.archivableOn,
    archivedAt: descriptor.archivedAt,
    isEServiceBeingArchived,
    eserviceArchivableOn: activeDescriptor?.archivableOn,
    t,
  })

  const latestDelegatedArchivingRequest = getLatestDelegatedDescriptorArchivingRequest(
    descriptor.delegatedArchivingRequest
  )

  const { requestedAt, rejectionReason, rejectedAt } = latestDelegatedArchivingRequest ?? {}

  const delegatorName = descriptor.delegation?.delegator.name || '-'

  const shouldShowDelegatedArchivingRequestRejectedAlert = Boolean(rejectedAt)

  const shouldShowDelegatedArchivingRequestAlert =
    Boolean(latestDelegatedArchivingRequest) && !shouldShowDelegatedArchivingRequestRejectedAlert

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

  if (
    !alert &&
    !shouldShowDelegatedArchivingRequestRejectedAlert &&
    !shouldShowDelegatedArchivingRequestAlert &&
    !shouldShowMissingKeychainAlert &&
    !shouldShowMissingKeychainKeysAlert
  )
    return null

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {alert && <Alert severity={alert.severity}>{alert.content}</Alert>}
      {shouldShowDelegatedArchivingRequestRejectedAlert && (
        <Alert
          severity="error"
          action={
            <Button
              color="primary"
              size="small"
              startIcon={<StickyNote2Icon />}
              sx={{ whiteSpace: 'nowrap' }}
              onClick={() => setIsRejectionReasonDrawerOpen(true)}
            >
              {t('delegatedDescriptorArchivingRequestRejectedAction')}
            </Button>
          }
        >
          {t('delegatedDescriptorArchivingRequestRejected')}
        </Alert>
      )}
      {shouldShowDelegatedArchivingRequestAlert && (
        <Alert severity="info">
          {t('delegatedDescriptorArchivingRequest', {
            date: requestedAt ? formatDateStringNumeric(requestedAt) : '-',
          })}
        </Alert>
      )}
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

      <Drawer
        isOpen={isRejectionReasonDrawerOpen}
        onClose={() => setIsRejectionReasonDrawerOpen(false)}
        title={t('delegatedDescriptorArchivingRequestRejectedDrawerTitle')}
        subtitle={t('delegatedDescriptorArchivingRequestRejectedDrawerSubtitle', {
          name: delegatorName,
        })}
        buttonAction={{
          label: t('delegatedDescriptorArchivingRequestRejectedDrawerAction'),
          action: () => setIsRejectionReasonDrawerOpen(false),
        }}
      >
        <Typography variant="body2">{rejectionReason || '-'}</Typography>
      </Drawer>
    </Stack>
  )
}
