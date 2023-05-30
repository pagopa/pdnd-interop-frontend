import type { CompactAttribute } from '@/api/api.generatedTypes'

export type AttributeKey = 'certified' | 'verified' | 'declared'

export type RemappedEServiceAttribute = {
  attributes: Array<CompactAttribute>
  explicitAttributeVerification: boolean
}

export type RemappedEServiceAttributes = Record<AttributeKey, Array<RemappedEServiceAttribute>>
