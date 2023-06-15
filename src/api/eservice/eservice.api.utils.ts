import type { RemappedEServiceAttributes } from '@/types/attribute.types'
import { getKeys } from '@/utils/array.utils'
import type { EServiceAttributes } from '../api.generatedTypes'

export function remapRemappedEServiceAttributesToBackend(
  _frontendAttributes: RemappedEServiceAttributes
): EServiceAttributes {
  const attributekeys = getKeys(_frontendAttributes)

  const frontendAttributes = { ..._frontendAttributes }

  attributekeys.forEach((key) => {
    frontendAttributes[key] = frontendAttributes[key].filter((group) => group.attributes.length > 0)
  })

  const mappedAttributes: EServiceAttributes = attributekeys.reduce(
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
