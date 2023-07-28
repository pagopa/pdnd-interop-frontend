import type {
  AttributeKey,
  RemappedDescriptorAttribute,
  RemappedDescriptorAttributes,
} from './../types/attribute.types'
import type {
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  DescriptorAttribute,
  DescriptorAttributes,
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
       * The attribute is considered revoked if it is in 'revokedBy' and not in 'verifiedBy' because
       * when we re-verify an attribute, the record inside 'verifiedBy' is added again, but the record inside 'revokedBy' is not removed.
       * There never is more than one entry in 'verifiedBy' array but there might be more than one in the revokedBy.
       */

      const typedAttribute = attribute as VerifiedTenantAttribute
      if (verifierId) {
        const isInRevokedBy = typedAttribute.revokedBy.some(
          (verifier) => verifier.id === verifierId
        )

        const isInVerifiedBy = typedAttribute.verifiedBy.some(
          (verifier) => verifier.id === verifierId
        )

        return isInRevokedBy && !isInVerifiedBy
      }

      /*
       * The attribute is considered revoked if it has been revoked at least once by any verifier.
       * We use a map to avoid checking the same id twice.
       *
       * The attribute, in this case, is considered revoked if it is in 'revokedBy' and not in 'verifiedBy'
       */
      const alreadyCheckedVerifierIds = new Map<string, boolean>()
      return typedAttribute.revokedBy.some(({ id }) => {
        if (alreadyCheckedVerifierIds.has(id)) return false
        alreadyCheckedVerifierIds.set(id, true)
        return !typedAttribute.verifiedBy.some((verifier) => verifier.id === id)
      })
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
   * For the verified attributes we check if verifiedBy has an entry which verifier id is the same as the verifierId passed.
   */
  switch (kind) {
    case 'certified':
      return !isAttributeRevoked('certified', match)
    case 'verified':
      return !isAttributeRevoked('verified', match as VerifiedTenantAttribute, verifierId)
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
  attributesGroup: RemappedDescriptorAttribute
): boolean
export function isAttributeGroupFullfilled(
  kind: 'verified',
  ownedAttributes: VerifiedTenantAttribute[],
  attributesGroup: RemappedDescriptorAttribute,
  verifierId: string | undefined
): boolean
export function isAttributeGroupFullfilled(
  kind: 'declared',
  ownedAttributes: DeclaredTenantAttribute[],
  attributesGroup: RemappedDescriptorAttribute
): boolean
export function isAttributeGroupFullfilled<TAttributeKey extends AttributeKey>(
  kind: TAttributeKey,
  ownedAttributes: TAttributeKey extends 'certified'
    ? CertifiedTenantAttribute[]
    : TAttributeKey extends 'verified'
    ? VerifiedTenantAttribute[]
    : DeclaredTenantAttribute[],
  attributesGroup: RemappedDescriptorAttribute,
  verifierId?: string
) {
  const isOwned = ({ id }: RemappedDescriptorAttribute['attributes'][0]) => {
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

  return attributesGroup.attributes.some(isOwned)
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
  descriptorAttributes: Array<RemappedDescriptorAttribute>
): boolean
export function hasAllDescriptorAttributes(
  kind: 'verified',
  ownedAttributes: VerifiedTenantAttribute[],
  descriptorAttributes: Array<RemappedDescriptorAttribute>,
  verifierId: string | undefined
): boolean
export function hasAllDescriptorAttributes(
  kind: 'declared',
  ownedAttributes: DeclaredTenantAttribute[],
  descriptorAttributes: Array<RemappedDescriptorAttribute>
): boolean
export function hasAllDescriptorAttributes(
  kind: AttributeKey,
  ownedAttributes:
    | VerifiedTenantAttribute[]
    | CertifiedTenantAttribute[]
    | DeclaredTenantAttribute[],
  descriptorAttributes: Array<RemappedDescriptorAttribute>,
  verifierId?: string
) {
  const isGroupFullfilled = (attributesGroup: RemappedDescriptorAttribute) => {
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
 * This function remaps the e-service attributes from the backend to the frontend.
 * The backend returns the attributes in a format that is not suitable for the frontend.
 * @param backendAttributes The e-service attributes from the backend.
 * @returns The e-service attributes in a format suitable for the frontend.
 *
 * @deprecated Should be removed when the backend updated the attribute structure.
 */
export function remapDescriptorAttributes(
  backendAttributes: DescriptorAttributes
): RemappedDescriptorAttributes {
  const descriptorAttributeToRemappedDescriptorAttribute = (
    descriptorAttribute: DescriptorAttribute
  ): RemappedDescriptorAttribute => {
    const isSingle = descriptorAttribute.hasOwnProperty('single')

    if (isSingle) {
      const single = descriptorAttribute.single!
      const { id, explicitAttributeVerification, name } = single
      return {
        attributes: [{ id, name }],
        explicitAttributeVerification,
      }
    }

    const group = descriptorAttribute.group
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

  const certified = backendAttributes.certified.map((descriptorAttribute) => {
    return descriptorAttributeToRemappedDescriptorAttribute(descriptorAttribute)
  })

  const verified = backendAttributes.verified.map((descriptorAttribute) => {
    return descriptorAttributeToRemappedDescriptorAttribute(descriptorAttribute)
  })

  const declared = backendAttributes.declared.map((descriptorAttribute) => {
    return descriptorAttributeToRemappedDescriptorAttribute(descriptorAttribute)
  })

  return { certified, verified, declared }
}
