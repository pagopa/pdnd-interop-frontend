import type {
  AttributeKey,
  RemappedEServiceAttribute,
  RemappedEServiceAttributes,
} from './../types/attribute.types'
import type {
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  EServiceAttribute,
  EServiceAttributes,
  VerifiedTenantAttribute,
} from '@/api/api.generatedTypes'

/**
 * Checks if an attribute is revoked.
 * @param kind The kind of attribute to check.
 * @param attribute The attribute to check.
 * @param verifierId The id of the verifier, should only be passed in if the kind is 'verified'. If passed, the attribute is considered revoked if it is verified by him.
 * @returns `true` if the attribute is considered revoked, false otherwise.
 */
export function isAttributeRevoked(kind: 'certified', attribute: CertifiedTenantAttribute): boolean
export function isAttributeRevoked(
  kind: 'verified',
  attribute: VerifiedTenantAttribute,
  verifierId?: string
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
       * If a verifierId is passed, the attribute is considered revoked if it is not verified by him
       */
      if (verifierId) {
        const isVerifiedByVerifier = (attribute as VerifiedTenantAttribute).verifiedBy.some(
          (verifier) => verifier.id === verifierId
        )
        return !isVerifiedByVerifier
      }
      /*
       *  if no verifierId is passed in, the attribute is considered revoked if it has no entries in 'verifiedBy'
       */
      return (attribute as VerifiedTenantAttribute).verifiedBy.length <= 0
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
  ownedAttributes: VerifiedTenantAttribute[]
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
    | DeclaredTenantAttribute[]
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
   */
  switch (kind) {
    case 'certified':
      return !isAttributeRevoked('certified', match as CertifiedTenantAttribute)
    case 'verified':
      return !isAttributeRevoked('verified', match as VerifiedTenantAttribute)
    case 'declared':
      return !isAttributeRevoked('declared', match as DeclaredTenantAttribute)
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
  attributesGroup: RemappedEServiceAttribute
): boolean
export function isAttributeGroupFullfilled(
  kind: 'verified',
  ownedAttributes: VerifiedTenantAttribute[],
  attributesGroup: RemappedEServiceAttribute
): boolean
export function isAttributeGroupFullfilled(
  kind: 'declared',
  ownedAttributes: DeclaredTenantAttribute[],
  attributesGroup: RemappedEServiceAttribute
): boolean
export function isAttributeGroupFullfilled(
  kind: AttributeKey,
  ownedAttributes:
    | VerifiedTenantAttribute[]
    | CertifiedTenantAttribute[]
    | DeclaredTenantAttribute[],
  attributesGroup: RemappedEServiceAttribute
) {
  const isOwned = ({ id }: RemappedEServiceAttribute['attributes'][0]) => {
    switch (kind) {
      case 'certified':
        return isAttributeOwned(kind, id, ownedAttributes as CertifiedTenantAttribute[])
      case 'verified':
        return isAttributeOwned(kind, id, ownedAttributes as VerifiedTenantAttribute[])
      case 'declared':
        return isAttributeOwned(kind, id, ownedAttributes as DeclaredTenantAttribute[])
      default:
        throw new Error(`Unknown attribute kind: ${kind}`)
    }
  }

  return attributesGroup.attributes.some(isOwned)
}

/**
 * Checks if the user owns all attributes of the given kind needed by the e-service.
 * @param kind The kind of attribute to check.
 * @param ownedAttributes The list of owned attributes to check against.
 * @param eserviceAttributes The list of e-service attributes to check.
 * @returns `true` if the user owns all attributes needed by the e-service, false otherwise.
 */
export function hasAllEServiceAttributes(
  kind: 'certified',
  ownedAttributes: CertifiedTenantAttribute[],
  eserviceAttributes: Array<RemappedEServiceAttribute>
): boolean
export function hasAllEServiceAttributes(
  kind: 'verified',
  ownedAttributes: VerifiedTenantAttribute[],
  eserviceAttributes: Array<RemappedEServiceAttribute>
): boolean
export function hasAllEServiceAttributes(
  kind: 'declared',
  ownedAttributes: DeclaredTenantAttribute[],
  eserviceAttributes: Array<RemappedEServiceAttribute>
): boolean
export function hasAllEServiceAttributes(
  kind: AttributeKey,
  ownedAttributes:
    | VerifiedTenantAttribute[]
    | CertifiedTenantAttribute[]
    | DeclaredTenantAttribute[],
  eserviceAttributes: Array<RemappedEServiceAttribute>
) {
  const isGroupFullfilled = (attributesGroup: RemappedEServiceAttribute) => {
    switch (kind) {
      case 'certified':
        return isAttributeGroupFullfilled(
          kind,
          ownedAttributes as CertifiedTenantAttribute[],
          attributesGroup
        )
      case 'verified':
        return isAttributeGroupFullfilled(
          kind,
          ownedAttributes as VerifiedTenantAttribute[],
          attributesGroup
        )
      case 'declared':
        return isAttributeGroupFullfilled(
          kind,
          ownedAttributes as DeclaredTenantAttribute[],
          attributesGroup
        )
      default:
        throw new Error(`Unknown attribute kind: ${kind}`)
    }
  }

  return eserviceAttributes.every(isGroupFullfilled)
}

/**
 * This function remaps the e-service attributes from the backend to the frontend.
 * The backend returns the attributes in a format that is not suitable for the frontend.
 * @param backendAttributes The e-service attributes from the backend.
 * @returns The e-service attributes in a format suitable for the frontend.
 * @deprecated Should be removed when the backend is fixed.
 */
export function remapEServiceAttributes(
  backendAttributes: EServiceAttributes
): RemappedEServiceAttributes {
  const eServiceAttributeToRemappedEServiceAttribute = (
    attributeType: keyof EServiceAttributes,
    eserviceAttribute: EServiceAttribute
  ): RemappedEServiceAttribute => {
    const isSingle = eserviceAttribute.hasOwnProperty('single')

    if (isSingle) {
      const single = eserviceAttribute.single!
      const { id, explicitAttributeVerification, name } = single
      return {
        attributes: [{ id, name }],
        explicitAttributeVerification,
      }
    }

    const group = eserviceAttribute.group
    return {
      attributes: [
        ...group!.map(({ id, name }) => ({
          id,
          name,
        })),
      ],
      explicitAttributeVerification: group![0].explicitAttributeVerification,
    }
  }

  const certified = backendAttributes.certified.map((eServiceAttribute) => {
    return eServiceAttributeToRemappedEServiceAttribute('certified', eServiceAttribute)
  })

  const verified = backendAttributes.verified.map((eServiceAttribute) => {
    return eServiceAttributeToRemappedEServiceAttribute('verified', eServiceAttribute)
  })

  const declared = backendAttributes.declared.map((eServiceAttribute) => {
    return eServiceAttributeToRemappedEServiceAttribute('declared', eServiceAttribute)
  })

  return { certified, verified, declared }
}
