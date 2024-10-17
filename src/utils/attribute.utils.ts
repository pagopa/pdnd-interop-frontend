import type { AttributeKey } from './../types/attribute.types'
import type {
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  DescriptorAttribute,
  DescriptorAttributeSeed,
  DescriptorAttributes,
  DescriptorAttributesSeed,
  VerifiedTenantAttribute,
} from '@/api/api.generatedTypes'

/**
 * Checks if an attribute is revoked.
 * @param kind The kind of attribute to check.
 * @param attribute The attribute to check.
 * @param verifierId The id of the verifier, should only be passed in if the kind is 'verified'. If passed, the attribute is considered revoked if it is verified by him,
 * if not the attribute is considered revoked if it has been revoked at least once by any verifier.
 * @returns `true` if the attribute is considered revoked, false otherwise.
 */
export function isAttributeRevoked(kind: 'certified', attribute: CertifiedTenantAttribute): boolean
export function isAttributeRevoked(
  kind: 'verified',
  attribute: VerifiedTenantAttribute,
  verifierId?: string | undefined
): boolean
export function isAttributeRevoked(kind: 'declared', attribute: DeclaredTenantAttribute): boolean
export function isAttributeRevoked(
  kind: AttributeKey,
  attribute: CertifiedTenantAttribute | VerifiedTenantAttribute | DeclaredTenantAttribute,
  verifierId?: string
) {
  switch (kind) {
    case 'certified':
      return Boolean((attribute as CertifiedTenantAttribute).revocationTimestamp)
    case 'verified':
      /*
       * If a verifierId is passed, the attribute is considered revoked if it is revoked by him.
       *
       * The attribute is considered revoked if it is in 'revokedBy'
       */

      const typedAttribute = attribute as VerifiedTenantAttribute

      if (verifierId) {
        return typedAttribute.revokedBy.some((verifier) => verifier.id === verifierId)
      }

      /*
       * The attribute is considered revoked if it has been revoked at least once by any verifier.
       */
      return typedAttribute.revokedBy.length > 0
    case 'declared':
      return Boolean((attribute as DeclaredTenantAttribute).revocationTimestamp)
    default:
      throw new Error(`Unknown attribute kind: ${kind}`)
  }
}

/**
 * Checks if an attribute can be considered owned by the user.
 * @param kind The kind of attribute to check.
 * @param attributeId The id of the attribute to check.
 * @param ownedAttributes The list of owned attributes to check against.
 * @returns `true` if the attribute is considered owned, false otherwise.
 */
export function isAttributeOwned(
  kind: 'certified',
  attributeId: string,
  ownedAttributes: CertifiedTenantAttribute[]
): boolean
export function isAttributeOwned(
  kind: 'verified',
  attributeId: string,
  ownedAttributes: VerifiedTenantAttribute[],
  verifierId: string | undefined
): boolean
export function isAttributeOwned(
  kind: 'declared',
  attributeId: string,
  ownedAttributes: DeclaredTenantAttribute[]
): boolean
export function isAttributeOwned(
  kind: AttributeKey,
  attributeId: string,
  ownedAttributes:
    | VerifiedTenantAttribute[]
    | CertifiedTenantAttribute[]
    | DeclaredTenantAttribute[],
  verifierId?: string
) {
  const matchIndex = ownedAttributes.findIndex((a) => a.id === attributeId)
  const match = ownedAttributes[matchIndex]

  /**
   * If no match is found, means that the tenant does not own the attribute.
   */
  if (!match) return false

  /**
   * If a match is found, last thing we need to check if it is revoked.
   * If it is, it is not considered "owned".
   * For the verified attributes we check if verifiedBy has an entry which verifier id is the same as the verifierId passed. Also
   * we check if the attribute is expired.
   */

  switch (kind) {
    case 'certified':
      return !isAttributeRevoked('certified', match)
    case 'verified':
      return isOwnedVerifiedAttributeNotExpired(match as VerifiedTenantAttribute, verifierId)
    case 'declared':
      return !isAttributeRevoked('declared', match)
    default:
      throw new Error(`Unknown attribute kind: ${kind}`)
  }
}

/**
 * Checks if an attribute group is fullfilled by the user.
 * For a group to be fullfilled, the user must own at least one of the attributes in the group.
 * @param kind The kind of attribute to check.
 * @param ownedAttributes The list of owned attributes to check against.
 * @param attributesGroup The group of attributes to check.
 * @returns `true` if the attribute group is fullfilled, false otherwise.
 */
export function isAttributeGroupFullfilled(
  kind: 'certified',
  ownedAttributes: CertifiedTenantAttribute[],
  attributesGroup: Array<DescriptorAttribute>
): boolean
export function isAttributeGroupFullfilled(
  kind: 'verified',
  ownedAttributes: VerifiedTenantAttribute[],
  attributesGroup: Array<DescriptorAttribute>,
  verifierId: string | undefined
): boolean
export function isAttributeGroupFullfilled(
  kind: 'declared',
  ownedAttributes: DeclaredTenantAttribute[],
  attributesGroup: Array<DescriptorAttribute>
): boolean
export function isAttributeGroupFullfilled<TAttributeKey extends AttributeKey>(
  kind: TAttributeKey,
  ownedAttributes: TAttributeKey extends 'certified'
    ? CertifiedTenantAttribute[]
    : TAttributeKey extends 'verified'
      ? VerifiedTenantAttribute[]
      : DeclaredTenantAttribute[],
  attributesGroup: Array<DescriptorAttribute>,
  verifierId?: string
) {
  const isOwned = ({ id }: DescriptorAttribute) => {
    switch (kind) {
      case 'certified':
        return isAttributeOwned(kind, id, ownedAttributes)
      case 'verified':
        return isAttributeOwned(kind, id, ownedAttributes as VerifiedTenantAttribute[], verifierId)
      case 'declared':
        return isAttributeOwned(kind, id, ownedAttributes)
      default:
        throw new Error(`Unknown attribute kind: ${kind}`)
    }
  }

  return attributesGroup.some(isOwned)
}

/**
 * Checks if the user owns all attributes of the given kind needed by the e-service.
 * @param kind The kind of attribute to check.
 * @param ownedAttributes The list of owned attributes to check against.
 * @param descriptorAttributes The list of e-service attributes to check.
 * @returns `true` if the user owns all attributes needed by the e-service, false otherwise.
 */
export function hasAllDescriptorAttributes(
  kind: 'certified',
  ownedAttributes: CertifiedTenantAttribute[],
  descriptorAttributes: Array<Array<DescriptorAttribute>>
): boolean
export function hasAllDescriptorAttributes(
  kind: 'verified',
  ownedAttributes: VerifiedTenantAttribute[],
  descriptorAttributes: Array<Array<DescriptorAttribute>>,
  verifierId: string | undefined
): boolean
export function hasAllDescriptorAttributes(
  kind: 'declared',
  ownedAttributes: DeclaredTenantAttribute[],
  descriptorAttributes: Array<Array<DescriptorAttribute>>
): boolean
export function hasAllDescriptorAttributes(
  kind: AttributeKey,
  ownedAttributes:
    | VerifiedTenantAttribute[]
    | CertifiedTenantAttribute[]
    | DeclaredTenantAttribute[],
  descriptorAttributes: Array<Array<DescriptorAttribute>>,
  verifierId?: string
) {
  const isGroupFullfilled = (attributesGroup: Array<DescriptorAttribute>) => {
    switch (kind) {
      case 'certified':
        return isAttributeGroupFullfilled(kind, ownedAttributes, attributesGroup)
      case 'verified':
        return isAttributeGroupFullfilled(
          kind,
          ownedAttributes as VerifiedTenantAttribute[],
          attributesGroup,
          verifierId
        )
      case 'declared':
        return isAttributeGroupFullfilled(kind, ownedAttributes, attributesGroup)
      default:
        throw new Error(`Unknown attribute kind: ${kind}`)
    }
  }

  return descriptorAttributes.every(isGroupFullfilled)
}

/**
 * This should be temporary, it is here because from the BFF we get the attributes in a different
 * format than the one we need to send to the API.
 * @param descriptorAttributes - The attributes to remap.
 * @returns The remapped attributes.
 */
export const remapDescriptorAttributesToDescriptorAttributesSeed = (
  descriptorAttributes: DescriptorAttributes
): DescriptorAttributesSeed => {
  const remapAttribute = (attr: DescriptorAttribute[][]): DescriptorAttributeSeed[][] => {
    return attr.map((attrGroup) => {
      return attrGroup.map((a) => ({ id: a.id, explicitAttributeVerification: true }))
    })
  }

  return {
    certified: remapAttribute(descriptorAttributes.certified),
    verified: remapAttribute(descriptorAttributes.verified),
    declared: remapAttribute(descriptorAttributes.declared),
  }
}

/**
 * Checks if a owned verified attribute  is expired based on extensionDate
 *
 * @param attribute - The attribute to check.
 * @param verifierId - The ID of the verifier (optional).
 * @return {boolean} True if the attribute is expired, false otherwise.
 */
const isOwnedVerifiedAttributeNotExpired = (
  attribute: VerifiedTenantAttribute,
  verifierId?: string
): boolean => {
  const today = Date.now()
  return attribute.verifiedBy.some((it) =>
    it.id === verifierId && it.extensionDate ? today <= new Date(it.extensionDate).getTime() : true
  )
}
