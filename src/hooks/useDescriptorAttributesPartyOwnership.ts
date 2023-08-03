import React from 'react'
import { AttributeQueries } from '@/api/attribute'
import { EServiceQueries } from '@/api/eservice'
import { hasAllDescriptorAttributes, remapDescriptorAttributes } from '@/utils/attribute.utils'
import { AuthHooks } from '@/api/auth'

/**
 * This hook checks if the user has all the attributes required from a descriptor.
 * @param eserviceId The e-service id.
 * @param descriptorId The descriptor id.
 */
export function useDescriptorAttributesPartyOwnership(
  eserviceId: string | undefined,
  descriptorId: string | undefined
) {
  const { jwt } = AuthHooks.useJwt()
  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(
    eserviceId as string,
    descriptorId as string,
    { enabled: !!(eserviceId && descriptorId), suspense: false }
  )

  const [{ data: ownedCertified }, { data: ownedVerified }, { data: ownedDeclared }] =
    AttributeQueries.useGetListParty(jwt?.organizationId, {
      suspense: false,
    })

  return React.useMemo(() => {
    if (!descriptor || !ownedCertified || !ownedDeclared || !ownedVerified)
      return {
        hasAllCertifiedAttributes: false,
        hasAllDeclaredAttributes: false,
        hasAllVerifiedAttributes: false,
      }

    if (descriptor.eservice.isMine)
      return {
        hasAllCertifiedAttributes: true,
        hasAllDeclaredAttributes: true,
        hasAllVerifiedAttributes: true,
      }

    const remapedDescriptorAttributes = remapDescriptorAttributes(descriptor.attributes)

    const hasAllCertifiedAttributes = hasAllDescriptorAttributes(
      'certified',
      ownedCertified.attributes,
      remapedDescriptorAttributes.certified
    )

    const hasAllVerifiedAttributes = hasAllDescriptorAttributes(
      'verified',
      ownedVerified.attributes,
      remapedDescriptorAttributes.verified,
      descriptor.eservice.producer.id
    )

    const hasAllDeclaredAttributes = hasAllDescriptorAttributes(
      'declared',
      ownedDeclared.attributes,
      remapedDescriptorAttributes.declared
    )

    return {
      hasAllCertifiedAttributes,
      hasAllDeclaredAttributes,
      hasAllVerifiedAttributes,
    }
  }, [descriptor, ownedCertified, ownedVerified, ownedDeclared])
}
