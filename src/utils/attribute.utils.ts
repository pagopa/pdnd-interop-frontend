import type { FrontendAttributes, PartyAttribute } from './../types/attribute.types'
import has from 'lodash/has'
import type { EServiceAttribute, EServiceAttributes } from '@/api/api.generatedTypes'
import identity from 'lodash/identity'

export function checkEServiceAttributesOwnership(
  partyAttributes: Array<PartyAttribute>,
  eserviceAttributes: Array<EServiceAttribute>
) {
  const partyAttributesIds = partyAttributes.filter((p) => p.state === 'ACTIVE').map((p) => p.id)

  const hasAllAttributes = eserviceAttributes.every((eserviceAttribute) => {
    if (has(eserviceAttribute, 'single')) {
      const match = partyAttributesIds.find((id) => id === eserviceAttribute.single?.id)
      return Boolean(match)
    }

    const match = partyAttributesIds.find((id) => {
      const groupIds = eserviceAttribute.group?.map((a) => a.id)
      return groupIds?.includes(id)
    })
    return Boolean(match)
  })

  return hasAllAttributes
}

export function remapEServiceAttributes(backendAttributes: EServiceAttributes): FrontendAttributes {
  const mappedAttributes: FrontendAttributes = Object.keys(backendAttributes).reduce(
    (acc, attributeType) => {
      const mapped = backendAttributes[attributeType as keyof EServiceAttributes]
        .map((attribute: EServiceAttribute) => {
          const isSingle = has(attribute, 'single')

          if (isSingle) {
            const single = attribute.single!
            const { id, explicitAttributeVerification, description, name } = single
            return {
              attributes: [{ id, description, name, kind: attributeType.toUpperCase() }],
              explicitAttributeVerification,
            }
          }

          const isGroup = has(attribute, 'group')

          if (isGroup) {
            const group = attribute.group
            return {
              attributes: [
                ...group!.map(({ id, description, name }) => ({
                  id,
                  description,
                  name,
                  kind: attributeType.toUpperCase(),
                })),
              ],
              explicitAttributeVerification: group![0].explicitAttributeVerification,
            }
          }
        })
        .filter(identity)
      return { ...acc, [attributeType]: mapped }
    },
    { certified: [], verified: [], declared: [] }
  )

  return mappedAttributes
}
