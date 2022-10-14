import has from 'lodash/has'
import {
  AttributeKey,
  BackendAttribute,
  BackendAttributes,
  ConsumerAttribute,
  CertifiedAttribute,
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  FrontendAttribute,
  FrontendAttributes,
  GroupBackendAttribute,
  SingleBackendAttribute,
  VerifiedTenantAttribute,
  ConsumerAttributes,
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

export function remapTenantBackendAttributesToFrontend(
  attributes: Record<
    AttributeKey,
    DeclaredTenantAttribute | CertifiedTenantAttribute | VerifiedTenantAttribute
  >[],
  providerId: string
) {
  return attributes.reduce(
    (acc, next) => {
      const attributeKey = Object.keys(next)[0] as AttributeKey
      const tenantAttribute = Object.values(next)[0]

      const attributeValue: Partial<ConsumerAttribute> = {
        id: tenantAttribute.id,
        name: tenantAttribute.name,
      }

      if (attributeKey !== 'verified') {
        attributeValue.state = tenantAttribute.revocationTimestamp ? 'REVOKED' : 'ACTIVE'
      } else {
        const verifiedTenantAttribute = tenantAttribute as VerifiedTenantAttribute
        const acceptedByProvider = verifiedTenantAttribute.verifiedBy.find(
          (a) => a.id === providerId
        )
        attributeValue.state = acceptedByProvider ? 'ACTIVE' : 'REVOKED'
      }

      acc[attributeKey].push(attributeValue as ConsumerAttribute)

      return acc
    },
    { certified: [], verified: [], declared: [] } as ConsumerAttributes
  )
}
