import {
  BackendAttribute,
  GroupBackendAttribute,
  PartyAttribute,
  SingleBackendAttribute,
} from '@/types/attribute.types'
import has from 'lodash/has'

export function checkCertifiedAttributesOwnership(
  partyAttributes: Array<PartyAttribute>,
  eserviceAttributes: Array<BackendAttribute>
) {
  const partyAttributesIds = partyAttributes.map((p) => p.id)

  const hasAllAttributes = eserviceAttributes.every((eserviceAttribute) => {
    if (has(eserviceAttribute, 'single')) {
      const match = partyAttributesIds.find(
        (id) => id === (eserviceAttribute as SingleBackendAttribute).single.id
      )
      return Boolean(match)
    }

    const match = partyAttributesIds.find((id) => {
      const groupIds = (eserviceAttribute as GroupBackendAttribute).group.map((a) => a.id)
      return groupIds.includes(id)
    })
    return Boolean(match)
  })

  return hasAllAttributes
}
