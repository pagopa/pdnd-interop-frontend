import type {
  ArchivingScope,
  AsyncExchangeProperties,
  CompactDescriptor,
  Document,
  EServiceDescriptorState,
  EServiceDoc,
} from '@/api/api.generatedTypes'
import type { AlertColor } from '@mui/material'
import type { TFunction } from 'i18next'
import { match } from 'ts-pattern'
import { formatDateStringNumeric } from './format.utils'

export const defaultAsyncExchangeProperties: AsyncExchangeProperties = {
  responseTime: 60,
  resourceAvailableTime: 60,
  maxResultSet: 1,
  confirmation: false,
  bulk: true,
}

export function getAsyncExchangePropertiesWithDefaults(
  asyncExchangeProperties: Partial<AsyncExchangeProperties> | undefined
): AsyncExchangeProperties {
  return {
    responseTime:
      asyncExchangeProperties?.responseTime ?? defaultAsyncExchangeProperties.responseTime,
    resourceAvailableTime:
      asyncExchangeProperties?.resourceAvailableTime ??
      defaultAsyncExchangeProperties.resourceAvailableTime,
    maxResultSet:
      asyncExchangeProperties?.maxResultSet ?? defaultAsyncExchangeProperties.maxResultSet,
    confirmation:
      asyncExchangeProperties?.confirmation ?? defaultAsyncExchangeProperties.confirmation,
    bulk: asyncExchangeProperties?.bulk ?? defaultAsyncExchangeProperties.bulk,
  }
}

export function getDownloadDocumentName(document: EServiceDoc | Document) {
  const filename: string = document.name
  const filenameBits: Array<string> = filename.split('.').filter((b) => b)
  const fileExtension = filenameBits[filenameBits.length - 1]
  return `${document.prettyName}.${fileExtension}`
}

export function getLastDescriptor(descriptors: Array<CompactDescriptor> | undefined) {
  const descriptor = descriptors?.find((descriptor) =>
    descriptors.every((d) => Number(descriptor.version) >= Number(d.version))
  )
  return descriptor
}

export function getActiveDescriptor(descriptors: Array<CompactDescriptor> | undefined) {
  return getLastDescriptor(
    descriptors?.filter(
      (d) => d.state !== 'DRAFT' && d.state !== 'WAITING_FOR_APPROVAL' && d.state !== 'ARCHIVED'
    )
  )
}

export function getViewLatestVersionTargetId(
  descriptors: Array<CompactDescriptor> | undefined,
  currentDescriptorId: string | undefined
) {
  const latestId = getLastDescriptor(
    descriptors?.filter(
      (d) => d.state !== 'DRAFT' && d.state !== 'WAITING_FOR_APPROVAL' && d.state !== 'ARCHIVED'
    )
  )?.id
  return latestId && latestId !== currentDescriptorId ? latestId : undefined
}

export function getEServiceDescriptorAlertSpec(args: {
  state: EServiceDescriptorState
  scope: ArchivingScope | undefined
  archivableOn: string | undefined
  archivedAt: string | undefined
  isEServiceBeingArchived?: boolean
  eserviceArchivableOn?: string
  t: TFunction<'eservice', 'read.alert'>
}): { severity: AlertColor; content: string } | undefined {
  const {
    state,
    scope,
    archivableOn,
    archivedAt,
    isEServiceBeingArchived,
    eserviceArchivableOn,
    t,
  } = args
  const scheduledDate = archivableOn ? formatDateStringNumeric(archivableOn) : ''
  const archivedDate = archivedAt ? formatDateStringNumeric(archivedAt) : ''
  const eserviceScheduledDate = eserviceArchivableOn
    ? formatDateStringNumeric(eserviceArchivableOn)
    : ''

  return match({ state, scope, isEServiceBeingArchived })
    .returnType<{ severity: AlertColor; content: string } | undefined>()
    .with({ state: 'SUSPENDED' }, () => ({ severity: 'error', content: t('suspended') }))
    .with({ state: 'DEPRECATED' }, () => ({ severity: 'info', content: t('deprecated') }))
    .with({ state: 'ARCHIVING', scope: 'DESCRIPTOR' }, () => ({
      severity: 'info',
      content: t('archivingDescriptor', { date: scheduledDate }),
    }))
    .with({ state: 'ARCHIVING', scope: 'ESERVICE' }, () => ({
      severity: 'info',
      content: t('archivingEService', { date: scheduledDate }),
    }))
    .with({ state: 'ARCHIVING_SUSPENDED', scope: 'DESCRIPTOR' }, () => ({
      severity: 'error',
      content: t('archivingSuspendedDescriptor', { date: scheduledDate }),
    }))
    .with({ state: 'ARCHIVING_SUSPENDED', scope: 'ESERVICE' }, () => ({
      severity: 'error',
      content: t('archivingSuspendedEService', { date: scheduledDate }),
    }))
    .with({ state: 'ARCHIVED', isEServiceBeingArchived: true }, () => ({
      severity: 'info',
      content: `${t('archivedDescriptor', { date: archivedDate })} ${t('archivingEService', {
        date: eserviceScheduledDate,
      })}`,
    }))
    .with({ state: 'ARCHIVED', scope: 'ESERVICE' }, () => ({
      severity: 'info',
      content: t('archivedEService', { date: archivedDate }),
    }))
    .with({ state: 'ARCHIVED' }, () => ({
      severity: 'info',
      content: t('archivedDescriptorNoConsumers'),
    }))
    .otherwise(() => undefined)
}

export function calculateArchivableOn(now: Date, gracePeriodDays: number): Date {
  const d = new Date(now)
  d.setUTCDate(d.getUTCDate() + gracePeriodDays + 1)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export function isDescriptorPendingArchiving(state: EServiceDescriptorState | undefined): boolean {
  return state === 'ARCHIVING' || state === 'ARCHIVING_SUSPENDED'
}
