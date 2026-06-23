import type {
  Agreement,
  ArchivingScope,
  CatalogDescriptorEService,
  CatalogEServiceDescriptor,
  EServiceDescriptorState,
} from '@/api/api.generatedTypes'
import type { AlertColor } from '@mui/material'
import type { TFunction } from 'i18next'
import { match } from 'ts-pattern'
import { formatDateString } from './format.utils'

/**
 * Checks if the user has already an agreement draft for the given e-service.
 * @param eservice The e-service to check
 * @returns `true` if the user has already an agreement draft for the given e-service, `false` otherwise
 */
export const checkIfhasAlreadyAgreementDraft = (
  eservice: CatalogDescriptorEService | undefined
) => {
  return eservice?.agreements.some((agreement) => agreement.state === 'DRAFT') ?? false
}
/**
 * Checks if the user can create an agreement draft for the given e-service.
 * @param tenantId The tenant id of the user to check
 * @param eservice The e-service to check
 * @param descriptor the actual viewing descriptor
 * @returns `true` if the user can create an agreement draft for the given e-service, `false` otherwise
 */
export const checkIfcanCreateAgreementDraft = (
  tenantId: string | undefined,
  descriptor?: CatalogEServiceDescriptor
) => {
  if (!descriptor || !tenantId) return false

  let result = false

  /**
   * I can subscribe to the eservice only if...
   * ... I own all the certified attributes...
   * ...or if the subscriber is the owner of the eservice...
   * */
  if (descriptor.eservice.hasCertifiedAttributes || descriptor.eservice.isMine) {
    result = true
  }

  const subscribedAgreements = descriptor.eservice.agreements.filter(
    (agreement) =>
      agreement.state === 'ACTIVE' ||
      agreement.state === 'SUSPENDED' ||
      agreement.state === 'PENDING'
  )
  const isSubscribed = subscribedAgreements.some((agreement) => agreement.consumerId === tenantId)

  const hasAgreementDraft = descriptor.eservice.agreements.some(
    (agreement) => agreement.state === 'DRAFT' && agreement.consumerId === tenantId
  )

  /**
   * ... but only if I'm not subscribed to it yet...
   * ... and I don't have an agreement draft...
   */
  if (isSubscribed || hasAgreementDraft) {
    result = false
  }

  // ... and the actual viewing descriptor is published or suspended!
  if (!['PUBLISHED', 'SUSPENDED'].includes(descriptor.state)) {
    result = false
  }

  return result
}

/**
 * The agreement can be upgraded if:
 * - The agreement is in ACTIVE or SUSPENDED state
 * - The active descriptor is in PUBLISHED or SUSPENDED state
 * - The active descriptor has a higher version than the agreement
 *
 * @param agreement The agreement to check
 * @returns `true` if the agreement can be upgraded, `false` otherwise
 */
export const canAgreementBeUpgraded = (agreement?: Agreement) => {
  if (!agreement) return false
  const eserviceActiveDescriptor = agreement.eservice.activeDescriptor
  if (!eserviceActiveDescriptor) return false

  const isActiveDescriptorPublishedOrSuspended = ['PUBLISHED', 'SUSPENDED'].includes(
    eserviceActiveDescriptor.state
  )
  const hasNewVersion =
    parseInt(eserviceActiveDescriptor.version, 10) > parseInt(agreement.eservice.version, 10)
  const isAgreementActiveOrSuspended = ['ACTIVE', 'SUSPENDED'].includes(agreement.state)

  return hasNewVersion && isActiveDescriptorPublishedOrSuspended && isAgreementActiveOrSuspended
}

/**
 * Check if there is an available new e-service version for the given agreement.
 * This is used in the agreement creation page.
 */
export const isNewEServiceVersionAvailable = (agreement: Agreement | undefined) => {
  const eserviceActiveDescriptor = agreement?.eservice.activeDescriptor
  return Boolean(
    eserviceActiveDescriptor &&
    parseInt(eserviceActiveDescriptor.version, 10) > parseInt(agreement.eservice.version, 10)
  )
}

export type ConsumerAgreementVersionAlertSpec = {
  severity: AlertColor
  content: string
  showSeeDetailsAction?: boolean
}

export function getConsumerAgreementVersionAlertSpec(args: {
  state: EServiceDescriptorState
  scope: ArchivingScope | undefined
  archivableOn: string | undefined
  archivedAt: string | undefined
  t: TFunction<'agreement', 'consumerRead.versionAlert'>
}): ConsumerAgreementVersionAlertSpec[] {
  const { state, scope, archivableOn, archivedAt, t } = args
  const scheduledDate = archivableOn ? formatDateString(archivableOn) : ''
  const archivedDate = archivedAt ? formatDateString(archivedAt) : ''

  return match({ state, scope })
    .returnType<ConsumerAgreementVersionAlertSpec[]>()
    .with({ state: 'DEPRECATED' }, () => [{ severity: 'info', content: t('deprecatedActive') }])
    .with({ state: 'ARCHIVING', scope: 'DESCRIPTOR' }, () => [
      { severity: 'warning', content: t('archivingDescriptor', { date: scheduledDate }) },
    ])
    .with({ state: 'ARCHIVING', scope: 'ESERVICE' }, () => [
      {
        severity: 'warning',
        content: t('archivingEService', { date: scheduledDate }),
        showSeeDetailsAction: true,
      },
    ])
    .with({ state: 'ARCHIVING_SUSPENDED', scope: 'DESCRIPTOR' }, () => [
      { severity: 'error', content: t('archivingSuspendedDescriptor', { date: scheduledDate }) },
    ])
    .with({ state: 'ARCHIVING_SUSPENDED', scope: 'ESERVICE' }, () => [
      { severity: 'error', content: t('suspendedLastNoNewVersion') },
      {
        severity: 'warning',
        content: t('archivingEService', { date: scheduledDate }),
        showSeeDetailsAction: true,
      },
    ])
    .with({ state: 'SUSPENDED' }, () => [{ severity: 'error', content: t('suspendedLast') }])
    .with({ state: 'ARCHIVED', scope: 'ESERVICE' }, () => [
      { severity: 'error', content: t('archivedEService', { date: archivedDate }) },
    ])
    .with({ state: 'ARCHIVED' }, () => [
      { severity: 'error', content: t('archivedDescriptor', { date: archivedDate }) },
    ])
    .otherwise(() => [])
}
