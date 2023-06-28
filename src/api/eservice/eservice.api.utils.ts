import type { RemappedEServiceAttributes } from '@/types/attribute.types'
import { getKeys } from '@/utils/array.utils'
import type { DescriptorAttributes, DescriptorAttributesSeed } from '../api.generatedTypes'

export function remapRemappedEServiceAttributesToBackend(
  _frontendAttributes: RemappedEServiceAttributes
): DescriptorAttributes {
  const attributekeys = getKeys(_frontendAttributes)

  const frontendAttributes = { ..._frontendAttributes }

  attributekeys.forEach((key) => {
    frontendAttributes[key] = frontendAttributes[key].filter((group) => group.attributes.length > 0)
  })

  const mappedAttributes: DescriptorAttributes = attributekeys.reduce(
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

export function remapDescriptorAttributesToDescriptorAttributesSeed(
  _attributes: DescriptorAttributes
) {
  const attributekeys = Object.keys(_attributes)

  const attributes = { ..._attributes }

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
