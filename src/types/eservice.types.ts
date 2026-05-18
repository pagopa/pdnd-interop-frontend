import type { CompactDescriptor, EServiceDescriptorState } from '@/api/api.generatedTypes'

// Local augmentation for the manual archiving feature (PIN-9936, SRS DRAFT).
// Until the BE OpenAPI is regenerated and `npm run generate-types` is run,
// these values are not present in `api.generatedTypes.ts`.
// Once the generated types include them, this file can be removed and the
// usages can switch to importing from `api.generatedTypes`.
export type EServiceDescriptorStateExtended =
  | EServiceDescriptorState
  | 'ARCHIVING'
  | 'ARCHIVING_SUSPENDED'

export type ArchivingSchedule = {
  archivableOn: string
  startedAt?: string
  scope?: 'Descriptor' | 'EService'
}

export type CompactDescriptorWithArchivingSchedule = Omit<CompactDescriptor, 'state'> & {
  state: EServiceDescriptorStateExtended
  archivingSchedule?: ArchivingSchedule
}
