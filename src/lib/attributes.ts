import { AttributeKey, Attributes, BackendFormattedAttributes } from '../../types'

export function formatAttributes(attributes: Attributes): BackendFormattedAttributes {
  const formattedAttributes = Object.keys(attributes).reduce(
    (acc, key) => {
      const attributesType = attributes[key as AttributeKey]
      const formatted = attributesType.map(({ group }) =>
        group.length === 1 ? { simple: group[0].id } : { group: group.map((g) => g.id) }
      )
      return { ...acc, [key]: formatted }
    },
    { certified: [], verified: [], declared: [] }
  )

  return formattedAttributes
}
