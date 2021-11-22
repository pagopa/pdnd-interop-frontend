import has from 'lodash/has'
import {
  BackendAttribute,
  BackendAttributes,
  FrontendAttributes,
  GroupBackendAttribute,
  SingleBackendAttribute,
} from '../../types'
import { getKeys } from './array-utils'

export function remapFrontendAttributesToBackend(
  frontendAttributes: FrontendAttributes
): BackendAttributes {
  const mappedAttributes: BackendAttributes = getKeys(frontendAttributes).reduce(
    (acc, attributeType) => {
      const mapped = frontendAttributes[attributeType].map(
        ({ attributes, explicitAttributeVerification }) =>
          attributes.length === 1
            ? { single: { id: attributes[0].id, explicitAttributeVerification } }
            : { group: attributes.map(({ id }) => ({ id, explicitAttributeVerification })) }
      )
      return { ...acc, [attributeType]: mapped }
    },
    { certified: [], verified: [], declared: [] }
  )

  return mappedAttributes
}

export function remapBackendAttributesToFrontend(
  backendAttributes: BackendAttributes
): FrontendAttributes {
  const mappedAttributes: FrontendAttributes = getKeys(backendAttributes).reduce(
    (acc, attributeType) => {
      const mapped = backendAttributes[attributeType].map((attribute) => {
        const isSingle = has(attribute, 'single')

        if (isSingle) {
          const { single } = attribute as SingleBackendAttribute
          const { id, explicitAttributeVerification, description, name } = single
          return { attributes: [{ id, description, name }], explicitAttributeVerification }
        }

        const { group } = attribute as GroupBackendAttribute
        return {
          attributes: [...group.map(({ id, description, name }) => ({ id, description, name }))],
          explicitAttributeVerification: group[0].explicitAttributeVerification,
        }
      })
      return { ...acc, [attributeType]: mapped }
    },
    { certified: [], verified: [], declared: [] }
  )

  return mappedAttributes
}

export function canSubscribe(
  partyAttributes: Array<string> | undefined,
  eserviceAttributes: Array<BackendAttribute>
) {
  if (!partyAttributes) {
    return false
  }

  const hasAllAttributes = eserviceAttributes.every((eserviceAttribute) => {
    if (has(eserviceAttribute, 'single')) {
      const match = partyAttributes.find(
        (a) => a === (eserviceAttribute as SingleBackendAttribute).single.id
      )
      return Boolean(match)
    }

    const match = partyAttributes.find((a) => {
      const groupIds = (eserviceAttribute as GroupBackendAttribute).group.map((a) => a.id)
      return groupIds.includes(a)
    })
    return Boolean(match)
  })

  return hasAllAttributes
}
