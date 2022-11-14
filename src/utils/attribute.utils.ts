import { FrontendAttributes } from './../types/attribute.types'
import {
  BackendAttribute,
  BackendAttributes,
  GroupBackendAttribute,
  PartyAttribute,
  SingleBackendAttribute,
} from '@/types/attribute.types'
import has from 'lodash/has'
import { getKeys } from './array.utils'

export function checkEServiceAttributesOwnership(
  partyAttributes: Array<PartyAttribute>,
  eserviceAttributes: Array<BackendAttribute>
) {
  const partyAttributesIds = partyAttributes.filter((p) => p.state === 'ACTIVE').map((p) => p.id)

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

export function remapEServiceAttributes(backendAttributes: BackendAttributes): FrontendAttributes {
  const mappedAttributes: FrontendAttributes = getKeys(backendAttributes).reduce(
    (acc, attributeType) => {
      const mapped = backendAttributes[attributeType].map((attribute) => {
        const isSingle = has(attribute, 'single')

        if (isSingle) {
          const { single } = attribute as SingleBackendAttribute
          const { id, explicitAttributeVerification, description, name } = single
          return {
            attributes: [{ id, description, name, kind: attributeType.toUpperCase() }],
            explicitAttributeVerification,
          }
        }

        const { group } = attribute as GroupBackendAttribute
        return {
          attributes: [
            ...group.map(({ id, description, name }) => ({
              id,
              description,
              name,
              kind: attributeType.toUpperCase(),
            })),
          ],
          explicitAttributeVerification: group[0].explicitAttributeVerification,
        }
      })
      return { ...acc, [attributeType]: mapped }
    },
    { certified: [], verified: [], declared: [] }
  )

  return mappedAttributes
}
