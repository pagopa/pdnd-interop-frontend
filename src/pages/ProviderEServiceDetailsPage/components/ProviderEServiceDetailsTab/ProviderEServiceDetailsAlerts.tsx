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
  const [rejectionReasonDrawerTarget, setRejectionReasonDrawerTarget] = React.useState<
    'descriptor' | 'eservice' | null
  >(null)

  const { t } = useTranslation('eservice', { keyPrefix: 'read.alert' })

  if (!descriptor) return null

  const activeDescriptor = getActiveDescriptor(descriptor.eservice.descriptors)
  const isEServiceBeingArchived = isDescriptorPendingArchiving(activeDescriptor?.state)
  const isCurrentDescriptorArchiving = isDescriptorPendingArchiving(descriptor.state)

  const alert = getEServiceDescriptorAlertSpec({
    state: descriptor.state,
    scope: descriptor.archivingSchedule?.scope,
    archivableOn: descriptor.archivingSchedule?.archivableOn,
    archivedAt: descriptor.archivedAt,
    isEServiceBeingArchived,
    eserviceArchivableOn: activeDescriptor?.archivableOn,
    t,
  })

  const { delegatedArchivingRequest } = descriptor
  const delegatedEServiceArchivingRequest = descriptor.eservice.delegatedArchivingRequest

  const requestedAt = delegatedArchivingRequest?.requestedAt
  const rejectionReason = delegatedArchivingRequest?.rejectionReason
  const rejectedAt = delegatedArchivingRequest?.rejectedAt

  const delegatorName = descriptor.delegation?.delegator.name || '-'

  const shouldShowDelegatedArchivingRequestRejectedAlert = Boolean(rejectedAt)

  const shouldShowDelegatedArchivingRequestAlert =
    Boolean(delegatedArchivingRequest) && !shouldShowDelegatedArchivingRequestRejectedAlert

  const delegatedEServiceArchivingRequestedAt = delegatedEServiceArchivingRequest?.requestedAt
  const delegatedEServiceArchivingRejectedAt = delegatedEServiceArchivingRequest?.rejectedAt
  const delegatedEServiceArchivingRejectionReason =
    delegatedEServiceArchivingRequest?.rejectionReason

  const delegatedEServiceArchivingDate = descriptor.archivingSchedule?.archivableOn
    ? formatDateStringNumeric(descriptor.archivingSchedule.archivableOn)
    : '-'

  const shouldShowDelegatedEServiceArchivingRequestRejectedAlert = Boolean(
    delegatedEServiceArchivingRejectedAt
  )

  const shouldShowDelegatedEServiceArchivingRequestAcceptedAlert = Boolean(
    delegatedEServiceArchivingRequest &&
    !delegatedEServiceArchivingRejectedAt &&
    isCurrentDescriptorArchiving
  )

  const shouldShowDelegatedEServiceArchivingRequestAlert =
    Boolean(delegatedEServiceArchivingRequest) &&
    !delegatedEServiceArchivingRejectedAt &&
    !isCurrentDescriptorArchiving

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
    !shouldShowDelegatedEServiceArchivingRequestRejectedAlert &&
    !shouldShowDelegatedEServiceArchivingRequestAcceptedAlert &&
    !shouldShowDelegatedEServiceArchivingRequestAlert &&
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
              onClick={() => setRejectionReasonDrawerTarget('descriptor')}
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
      {shouldShowDelegatedEServiceArchivingRequestRejectedAlert && (
        <Alert
          severity="error"
          action={
            <Button
              color="primary"
              size="small"
              startIcon={<StickyNote2Icon />}
              sx={{ whiteSpace: 'nowrap' }}
              onClick={() => setRejectionReasonDrawerTarget('eservice')}
            >
              {t('delegatedEServiceArchivingRequestRejectedAction')}
            </Button>
          }
        >
          {t('delegatedEServiceArchivingRequestRejected')}
        </Alert>
      )}
      {shouldShowDelegatedEServiceArchivingRequestAcceptedAlert && !alert && (
        <Alert severity="info">
          {t('archivingEService', {
            date: delegatedEServiceArchivingDate,
          })}
        </Alert>
      )}
      {shouldShowDelegatedEServiceArchivingRequestAlert && (
        <Alert severity="info">
          {t('delegatedEServiceArchivingRequest', {
            date: delegatedEServiceArchivingRequestedAt
              ? formatDateStringNumeric(delegatedEServiceArchivingRequestedAt)
              : '-',
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
        isOpen={rejectionReasonDrawerTarget !== null}
        onClose={() => setRejectionReasonDrawerTarget(null)}
        title={
          rejectionReasonDrawerTarget === 'eservice'
            ? t('delegatedEServiceArchivingRequestRejectedDrawerTitle')
            : t('delegatedDescriptorArchivingRequestRejectedDrawerTitle')
        }
        subtitle={
          rejectionReasonDrawerTarget === 'eservice'
            ? t('delegatedEServiceArchivingRequestRejectedDrawerSubtitle', {
                name: delegatorName,
              })
            : t('delegatedDescriptorArchivingRequestRejectedDrawerSubtitle', {
                name: delegatorName,
              })
        }
        buttonAction={{
          label:
            rejectionReasonDrawerTarget === 'eservice'
              ? t('delegatedEServiceArchivingRequestRejectedDrawerAction')
              : t('delegatedDescriptorArchivingRequestRejectedDrawerAction'),
          action: () => setRejectionReasonDrawerTarget(null),
        }}
      >
        <Typography variant="body2">
          {rejectionReasonDrawerTarget === 'eservice'
            ? delegatedEServiceArchivingRejectionReason || '-'
            : rejectionReason || '-'}
        </Typography>
      </Drawer>
    </Stack>
  )
}
