import { FrontendAttribute, PartyAttribute } from '@/types/attribute.types'

export const isAttributeOwned = (partyAttributes: Array<PartyAttribute>, attributeId: string) => {
  const partyAttributesIds = partyAttributes
    .filter(({ state }) => state === 'ACTIVE')
    .map(({ id }) => id)
  return partyAttributesIds.includes(attributeId)
}

export const isGroupFullfilled = (
  partyAttributes: Array<PartyAttribute>,
  group: FrontendAttribute
) => {
  return group.attributes.some(({ id }) => isAttributeOwned(partyAttributes, id))
}
