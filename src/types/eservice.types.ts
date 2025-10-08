import type { CompactPurposeTemplateEService, CompactDescriptor } from '@/api/api.generatedTypes'

/**
 * Type that represents the structure returned by the API for eservices linked to purpose templates.
 * This combines a CompactPurposeTemplateEService with its associated CompactDescriptor.
 */
export type EServiceWithDescriptor = {
  eservice: CompactPurposeTemplateEService
  descriptor: CompactDescriptor
}
