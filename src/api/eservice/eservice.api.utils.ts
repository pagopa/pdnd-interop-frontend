import type { RemappedDescriptorAttributes } from '@/types/attribute.types'
import { getKeys } from '@/utils/array.utils'
import type { DescriptorAttributes, DescriptorAttributesSeed } from '../api.generatedTypes'

/**
 * Remaps back the remapped attributes to the original format that the backend expects
 *
 * @param _remappedAttributes The remapped attributes
 * @returns The attributes in the original format
 */
export function remapRemappedDescriptorAttributesToDescriptorAttributes(
  _remappedAttributes: RemappedDescriptorAttributes
): DescriptorAttributes {
  const attributekeys = getKeys(_remappedAttributes)

  const remappedAttributes = { ..._remappedAttributes }

  attributekeys.forEach((key) => {
    remappedAttributes[key] = remappedAttributes[key].filter((group) => group.attributes.length > 0)
  })

  const mappedAttributes: DescriptorAttributes = attributekeys.reduce(
    (acc, attributeType) => {
      const mapped = remappedAttributes[attributeType].map(
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

/**
 * This remapping is needed because the backend expects in the update version draft call the attributes
 * in the `DescriptorAttributesSeed` format
 *
 * @param attributes The attributes to remap
 * @returns The attributes in the `DescriptorAttributesSeed` format
 */
export function remapDescriptorAttributesToDescriptorAttributesSeed(
  attributes: DescriptorAttributes
): DescriptorAttributesSeed {
  const attributekeys = Object.keys(attributes)

  const mappedAttributes: DescriptorAttributesSeed = attributekeys.reduce(
    (accumulator, attributeTypeKey) => {
      const mapped = attributes[attributeTypeKey as keyof DescriptorAttributes].map(
        ({ single, group }) =>
          single
            ? {
                single: {
                  id: single.id,
                  explicitAttributeVerification: single.explicitAttributeVerification,
                },
              }
            : {
                group: group?.map(({ id, explicitAttributeVerification }) => ({
                  id: id,
                  explicitAttributeVerification: explicitAttributeVerification,
                })),
              }
      )
      return { ...accumulator, [attributeTypeKey]: mapped }
    },
    { certified: [], verified: [], declared: [] }
  )

  return mappedAttributes
}
