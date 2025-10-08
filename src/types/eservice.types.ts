import type { CompactEService, CompactDescriptor } from '@/api/api.generatedTypes'

/**
 * Type that represents the structure returned by the API for eservices linked to purpose templates.
 * This combines a CompactEService with its associated CompactDescriptor.
 */
export type EServiceWithDescriptor = {
  eservice: CompactEService
  descriptor: CompactDescriptor
}
