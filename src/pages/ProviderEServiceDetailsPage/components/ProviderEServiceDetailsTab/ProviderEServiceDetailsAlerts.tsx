import React from 'react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Alert, Button, Stack, Typography } from '@mui/material'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import { useTranslation } from 'react-i18next'
import { formatDateStringNumeric } from '@/utils/format.utils'
import { Drawer } from '@/components/shared/Drawer'
import { AuthHooks } from '@/api/auth'
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
  const { jwt } = AuthHooks.useJwt()

  if (!descriptor) return null

  const isDelegate = descriptor.delegation?.delegate.id === jwt?.organizationId

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

  const delegatedArchivingRequest = descriptor.eservice.delegatedArchivingRequest
  const isDescriptorDelegatedArchivingRequest = Boolean(
    delegatedArchivingRequest && delegatedArchivingRequest.descriptorId === descriptor.id
  )
  const isEServiceDelegatedArchivingRequest = Boolean(
    delegatedArchivingRequest && !delegatedArchivingRequest.descriptorId
  )

  const delegatorName = descriptor.delegation?.delegator.name || '-'

  const shouldShowDelegatedVersionArchivingRequestRejectedAlert = Boolean(
    isDelegate && isDescriptorDelegatedArchivingRequest && delegatedArchivingRequest?.rejectedAt
  )

  const shouldShowDelegatedVersionArchivingRequestAlert =
    isDelegate &&
    isDescriptorDelegatedArchivingRequest &&
    !shouldShowDelegatedVersionArchivingRequestRejectedAlert &&
    !isCurrentDescriptorArchiving

  const shouldShowDelegatedVersionArchivingRequestAcceptedAlert = Boolean(
    isDelegate &&
    isDescriptorDelegatedArchivingRequest &&
    !delegatedArchivingRequest?.rejectedAt &&
    isCurrentDescriptorArchiving
  )

  const delegatedEServiceArchivingDate = descriptor.archivingSchedule?.archivableOn
    ? formatDateStringNumeric(descriptor.archivingSchedule.archivableOn)
    : '-'

  const shouldShowDelegatedEServiceArchivingRequestRejectedAlert = Boolean(
    isDelegate && isEServiceDelegatedArchivingRequest && delegatedArchivingRequest?.rejectedAt
  )

  const shouldShowDelegatedEServiceArchivingRequestAcceptedAlert = Boolean(
    isDelegate &&
    isEServiceDelegatedArchivingRequest &&
    !delegatedArchivingRequest?.rejectedAt &&
    isCurrentDescriptorArchiving
  )

  const shouldShowDelegatedEServiceArchivingRequestAlert =
    isDelegate &&
    isEServiceDelegatedArchivingRequest &&
    !delegatedArchivingRequest?.rejectedAt &&
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
    !shouldShowDelegatedVersionArchivingRequestRejectedAlert &&
    !shouldShowDelegatedVersionArchivingRequestAlert &&
    !shouldShowDelegatedVersionArchivingRequestAcceptedAlert &&
    !shouldShowDelegatedEServiceArchivingRequestRejectedAlert &&
    !shouldShowDelegatedEServiceArchivingRequestAcceptedAlert &&
    !shouldShowDelegatedEServiceArchivingRequestAlert &&
    !shouldShowMissingKeychainAlert &&
    !shouldShowMissingKeychainKeysAlert
  )
    return null

  const shouldHideGenericAlert =
    shouldShowDelegatedVersionArchivingRequestAlert ||
    shouldShowDelegatedVersionArchivingRequestAcceptedAlert ||
    shouldShowDelegatedEServiceArchivingRequestAlert ||
    shouldShowDelegatedEServiceArchivingRequestAcceptedAlert

  const visibleGenericAlert = shouldHideGenericAlert ? null : alert

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {visibleGenericAlert && (
        <Alert severity={visibleGenericAlert.severity}>{visibleGenericAlert.content}</Alert>
      )}
      {shouldShowDelegatedVersionArchivingRequestRejectedAlert && (
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
      {shouldShowDelegatedVersionArchivingRequestAlert && (
        <Alert severity="info">
          {t('delegatedDescriptorArchivingRequest', {
            date: delegatedArchivingRequest?.requestedAt
              ? formatDateStringNumeric(delegatedArchivingRequest.requestedAt)
              : '-',
          })}
        </Alert>
      )}
      {shouldShowDelegatedVersionArchivingRequestAcceptedAlert && (
        <Alert severity="info">
          {t('archivingDescriptor', {
            date: descriptor.archivingSchedule?.archivableOn
              ? formatDateStringNumeric(descriptor.archivingSchedule.archivableOn)
              : '-',
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
      {shouldShowDelegatedEServiceArchivingRequestAcceptedAlert && (
        <Alert severity="info">
          {t('archivingEService', {
            date: delegatedEServiceArchivingDate,
          })}
        </Alert>
      )}
      {shouldShowDelegatedEServiceArchivingRequestAlert && (
        <Alert severity="info">
          {t('delegatedEServiceArchivingRequest', {
            date: delegatedArchivingRequest?.requestedAt
              ? formatDateStringNumeric(delegatedArchivingRequest.requestedAt)
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
        <Typography variant="body2">{delegatedArchivingRequest?.rejectionReason || '-'}</Typography>
      </Drawer>
    </Stack>
  )
}
