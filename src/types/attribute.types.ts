import type { AttributeKind, CompactAttribute } from '@/api/api.generatedTypes'

export type AttributeKey = Lowercase<AttributeKind>

export type RemappedDescriptorAttribute = {
  attributes: Array<CompactAttribute>
  explicitAttributeVerification: boolean
}

export type RemappedDescriptorAttributes = Record<AttributeKey, Array<RemappedDescriptorAttribute>>
