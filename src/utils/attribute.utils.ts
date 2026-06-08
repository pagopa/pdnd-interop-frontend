import { match } from 'ts-pattern'
import type {
  AttributeKey,
  FormDescriptorAttribute,
  FormDescriptorAttributes,
} from './../types/attribute.types'
import type {
  CertifiedDiscreteTenantAttribute,
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  DescriptorAttribute,
  DescriptorAttributeSeed,
  DescriptorAttributes,
  DescriptorAttributesSeed,
  TenantAttributes,
  EServiceAttributeCertifiedDiscreteConfig,
  VerifiedTenantAttribute,
  StandardCertifiedTenantAttribute,
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
  ownedAttributes: TenantAttributes['certified'],
  options?: { discreteConfig?: EServiceAttributeCertifiedDiscreteConfig }
): boolean
export function isAttributeOwned(
  kind: 'verified',
  attributeId: string,
  ownedAttributes: TenantAttributes['verified'],
  options?: { verifierId?: string }
): boolean
export function isAttributeOwned(
  kind: 'declared',
  attributeId: string,
  ownedAttributes: TenantAttributes['declared']
): boolean
export function isAttributeOwned(
  kind: AttributeKey,
  attributeId: string,
  ownedAttributes: TenantAttributes[AttributeKey],
  options?: { verifierId?: string; discreteConfig?: EServiceAttributeCertifiedDiscreteConfig }
) {
  const matchIndex = ownedAttributes.findIndex((a) => a.id === attributeId)

  if (matchIndex === -1) {
    return false
  }

  const attributeMatched = ownedAttributes[matchIndex]

  /**
   * If no match is found, means that the tenant does not own the attribute.
   */
  if (!attributeMatched) return false

  /**
   * If a match is found, last thing we need to check if it is revoked.
   * If it is, it is not considered "owned".
   * For the verified attributes we check if verifiedBy has an entry which verifier id is the same as the verifierId passed. Also
   * we check if the attribute is expired.
   */
  switch (kind) {
    case 'certified':
      return match(attributeMatched.kind)
        .with('CERTIFIED', () => {
          return !isAttributeRevoked(
            'certified',
            attributeMatched as StandardCertifiedTenantAttribute
          )
        })
        .with('CERTIFIED_DISCRETE', () => {
          return (
            !isAttributeRevoked(
              'certified',
              attributeMatched as CertifiedDiscreteTenantAttribute
            ) &&
            (options?.discreteConfig
              ? isAttributeCompliantWithDiscreteConfig(
                  attributeMatched as CertifiedDiscreteTenantAttribute,
                  options.discreteConfig
                )
              : false)
          )
        })
        .otherwise(() => false)
    case 'verified':
      return isOwnedVerifiedAttributeNotExpired(
        attributeMatched as VerifiedTenantAttribute,
        options?.verifierId
      )
    case 'declared':
      return !isAttributeRevoked('declared', attributeMatched as DeclaredTenantAttribute)
    default:
      throw new Error(`Unknown attribute kind: ${kind}`)
  }
}

export function isAttributeCompliantWithDiscreteConfig(
  attribute: CertifiedDiscreteTenantAttribute,
  discreteConfig: EServiceAttributeCertifiedDiscreteConfig
): boolean {
  const isCompliant = match(discreteConfig.comparator)
    .with('GT', () => attribute.discreteValue > discreteConfig.threshold)
    .with('GTE', () => attribute.discreteValue >= discreteConfig.threshold)
    .with('LT', () => attribute.discreteValue < discreteConfig.threshold)
    .with('LTE', () => attribute.discreteValue <= discreteConfig.threshold)
    .with('EQ', () => attribute.discreteValue === discreteConfig.threshold)
    .with('NE', () => attribute.discreteValue !== discreteConfig.threshold)
    .exhaustive()

  return isCompliant
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
  ownedAttributes: TenantAttributes['certified'],
  attributesGroup: Array<DescriptorAttribute>
): boolean
export function isAttributeGroupFullfilled(
  kind: 'verified',
  ownedAttributes: TenantAttributes['verified'],
  attributesGroup: Array<DescriptorAttribute>,
  verifierId: string | undefined
): boolean
export function isAttributeGroupFullfilled(
  kind: 'declared',
  ownedAttributes: TenantAttributes['declared'],
  attributesGroup: Array<DescriptorAttribute>
): boolean
export function isAttributeGroupFullfilled(
  kind: AttributeKey,
  ownedAttributes: TenantAttributes[AttributeKey],
  attributesGroup: Array<DescriptorAttribute>,
  verifierId?: string
) {
  const isOwned = ({ id, discreteConfig }: DescriptorAttribute) => {
    switch (kind) {
      case 'certified':
        return isAttributeOwned(
          kind,
          id,
          ownedAttributes as TenantAttributes['certified'],
          discreteConfig ? { discreteConfig } : undefined
        )
      case 'verified':
        return isAttributeOwned(kind, id, ownedAttributes as TenantAttributes['verified'], {
          verifierId,
        })
      case 'declared':
        return isAttributeOwned(kind, id, ownedAttributes as TenantAttributes['declared'])
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
  ownedAttributes: TenantAttributes['certified'],
  descriptorAttributes: Array<Array<DescriptorAttribute>>
): boolean
export function hasAllDescriptorAttributes(
  kind: 'verified',
  ownedAttributes: TenantAttributes['verified'],
  descriptorAttributes: Array<Array<DescriptorAttribute>>,
  verifierId: string | undefined
): boolean
export function hasAllDescriptorAttributes(
  kind: 'declared',
  ownedAttributes: TenantAttributes['declared'],
  descriptorAttributes: Array<Array<DescriptorAttribute>>
): boolean
export function hasAllDescriptorAttributes(
  kind: AttributeKey,
  ownedAttributes: TenantAttributes[AttributeKey],
  descriptorAttributes: Array<Array<DescriptorAttribute>>,
  verifierId?: string
) {
  const isGroupFullfilled = (attributesGroup: Array<DescriptorAttribute>) => {
    switch (kind) {
      case 'certified':
        return isAttributeGroupFullfilled(
          kind,
          ownedAttributes as TenantAttributes['certified'],
          attributesGroup
        )
      case 'verified':
        return isAttributeGroupFullfilled(
          kind,
          ownedAttributes as TenantAttributes['verified'],
          attributesGroup,
          verifierId
        )
      case 'declared':
        return isAttributeGroupFullfilled(
          kind,
          ownedAttributes as TenantAttributes['declared'],
          attributesGroup
        )
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
// TODO
export const remapFormDescriptorAttributesToDescriptorAttributesSeed = (
  formDescriptorAttributes: FormDescriptorAttributes
): DescriptorAttributesSeed => {
  const remapAttribute = (attr: FormDescriptorAttribute[][]): DescriptorAttributeSeed[][] => {
    return attr.map((attrGroup) => {
      return attrGroup.map((a) => ({
        id: a.id,
        explicitAttributeVerification: true,
        dailyCallsPerConsumer: a?.dailyCallsPerConsumer,
        discreteConfig: a?.discreteConfig,
      }))
    })
  }

  return {
    certified: remapAttribute(formDescriptorAttributes.certified),
    verified: remapAttribute(formDescriptorAttributes.verified),
    declared: remapAttribute(formDescriptorAttributes.declared),
  }
}

export const remapDescriptorAttributesToFormDescriptorAttributes = (
  descriptorAttributes: DescriptorAttributes
): FormDescriptorAttributes => {
  const remapAttribute = (attr: DescriptorAttribute[][]): FormDescriptorAttribute[][] => {
    return attr.map((attrGroup) => {
      return attrGroup.map((a) => ({
        id: a.id,
        name: a.name,
        kind: a.kind,
        dailyCallsPerConsumer: a?.dailyCallsPerConsumer,
        discreteConfig: a?.discreteConfig,
      }))
    })
  }

  return {
    certified: remapAttribute(descriptorAttributes.certified),
    verified: remapAttribute(descriptorAttributes.verified),
    declared: remapAttribute(descriptorAttributes.declared),
  }
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
      return attrGroup.map((a) => ({
        id: a.id,
        explicitAttributeVerification: true,
        dailyCallsPerConsumer: a?.dailyCallsPerConsumer,
        discreteConfig: a?.discreteConfig,
      }))
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
  return attribute.verifiedBy.some(
    (it) =>
      it.id === verifierId &&
      (it.extensionDate ? today <= new Date(it.extensionDate).getTime() : true)
  )
}
