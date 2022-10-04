import has from 'lodash/has'
import {
  BackendAttribute,
  BackendAttributes,
  CertifiedAttribute,
  FrontendAttribute,
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
  partyAttributes: Array<CertifiedAttribute>,
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

export function checkOwnershipFrontendAttributes(
  attributes: Array<FrontendAttribute>,
  ownedAttributesIds: Array<string>
) {
  function checkIfGroupHasOwnedAttribute(attributeGroup: FrontendAttribute) {
    return attributeGroup.attributes.some((att) => ownedAttributesIds.includes(att.id))
  }
  return attributes.every(checkIfGroupHasOwnedAttribute)
}
