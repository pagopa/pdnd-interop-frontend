import type { FrontendAttribute, PartyAttribute } from '@/types/attribute.types'

export const getAttributeState = (partyAttributes: Array<PartyAttribute>, attributeId: string) => {
  return partyAttributes.find(({ id }) => id === attributeId)?.state
}

export const isGroupFullfilled = (
  partyAttributes: Array<PartyAttribute>,
  group: FrontendAttribute
) => {
  return group.attributes.some(({ id }) => getAttributeState(partyAttributes, id) === 'ACTIVE')
}
