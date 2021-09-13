import has from 'lodash/has'
import {
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
          const { id, explicitAttributeVerification } = single
          return { attributes: [{ id }], explicitAttributeVerification }
        }

        const { group } = attribute as GroupBackendAttribute
        return {
          attributes: [...group.map(({ id }) => ({ id }))],
          explicitAttributeVerification: group[0].explicitAttributeVerification,
        }
      })
      return { ...acc, [attributeType]: mapped }
    },
    { certified: [], verified: [], declared: [] }
  )

  return mappedAttributes
}

export function unformatAttributes(formattedAttributes: any): any {
  // const unformattedAttributes = Object.keys(formattedAttributes).reduce(
  //   (acc, key) => {
  //     const attributesType = formattedAttributes[key as AttributeKey]
  //     const unformatted = attributesType.map((simple, group) => (simple ? [simple] : group))
  //     return { ...acc, [key]: unformatted }
  //   },
  //   { certified: [], verified: [], declared: [] }
  // )

  // return unformattedAttributes
  return formattedAttributes
}
