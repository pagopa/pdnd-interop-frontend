import type {
  CompactDescriptor,
  Document,
  EServiceDescriptorState,
  EServiceDoc,
  ArchivingScope,
} from '@/api/api.generatedTypes'
import type { AlertColor } from '@mui/material'
import type { TFunction } from 'i18next'
import { match } from 'ts-pattern'
import { formatDateString } from './format.utils'

export function getDownloadDocumentName(document: EServiceDoc | Document) {
  const filename: string = document.name
  const filenameBits: Array<string> = filename.split('.').filter((b) => b)
  const fileExtension = filenameBits[filenameBits.length - 1]
  return `${document.prettyName}.${fileExtension}`
}

export function getLastDescriptor(descriptors: Array<CompactDescriptor> | undefined) {
  const descriptor = descriptors?.find((descriptor) =>
    descriptors.every((d) => descriptor.version >= d.version)
  )
  return descriptor
}

export function getEServiceDescriptorAlertSpec(args: {
  state: EServiceDescriptorState
  scope: ArchivingScope | undefined
  archivableOn: string | undefined
  archivedAt: string | undefined
  t: TFunction<'eservice', 'read.alert'>
}): { severity: AlertColor; content: string } | undefined {
  const { state, scope, archivableOn, archivedAt, t } = args
  const scheduledDate = archivableOn ? formatDateString(archivableOn) : ''
  const archivedDate = archivedAt ? formatDateString(archivedAt) : ''

  return match({ state, scope })
    .returnType<{ severity: AlertColor; content: string } | undefined>()
    .with({ state: 'SUSPENDED' }, () => ({ severity: 'error', content: t('suspended') }))
    .with({ state: 'DEPRECATED' }, () => ({ severity: 'info', content: t('deprecated') }))
    .with({ state: 'ARCHIVING', scope: 'DESCRIPTOR' }, () => ({
      severity: 'info',
      content: t('archivingDescriptor', { date: scheduledDate }),
    }))
    .with({ state: 'ARCHIVING_SUSPENDED', scope: 'DESCRIPTOR' }, () => ({
      severity: 'error',
      content: t('archivingSuspendedDescriptor', { date: scheduledDate }),
    }))
    .with({ state: 'ARCHIVING_SUSPENDED', scope: 'ESERVICE' }, () => ({
      severity: 'error',
      content: t('archivingSuspendedEService', { date: scheduledDate }),
    }))
    .with({ state: 'ARCHIVED', scope: 'ESERVICE' }, () => ({
      severity: 'info',
      content: t('archivedEService', { date: archivedDate }),
    }))
    .with({ state: 'ARCHIVED' }, () => ({
      severity: 'info',
      content: t('archivedDescriptor', { date: archivedDate }),
    }))
    .otherwise(() => undefined)
}
