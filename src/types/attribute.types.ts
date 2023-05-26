import type { CompactAttribute } from '@/api/api.generatedTypes'

export type AttributeKey = 'certified' | 'verified' | 'declared'

export type FrontendAttribute = {
  attributes: Array<CompactAttribute>
  explicitAttributeVerification: boolean
}

export type FrontendAttributes = Record<AttributeKey, Array<FrontendAttribute>>

export type PartyAttributes = Record<AttributeKey, Array<PartyAttribute>>

export type AttributeState = 'ACTIVE' | 'REVOKED'

export type PartyAttribute = {
  id: string
  name: string
  state: AttributeState
  kind: 'certified' | 'declared' | 'verified'
}
