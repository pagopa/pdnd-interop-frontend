import React from 'react'
import { AttributeQueries } from '@/api/attribute'
import { EServiceQueries } from '@/api/eservice'
import { hasAllDescriptorAttributes } from '@/utils/attribute.utils'
import { useQueries, useQuery } from '@tanstack/react-query'

/**
 * This hook checks if the user has all the attributes required from a descriptor.
 * @param eserviceId The e-service id.
 * @param descriptorId The descriptor id.
 * @param tenantId The tenant id.
 */
export function useDescriptorAttributesPartyOwnership(
  eserviceId: string | undefined,
  descriptorId: string | undefined,
  tenantId: string | undefined
) {
  const { data: descriptor } = useQuery({
    ...EServiceQueries.getDescriptorCatalog(eserviceId!, descriptorId!),
    enabled: Boolean(eserviceId && descriptorId),
  })

  const [{ data: ownedCertified }, { data: ownedVerified }, { data: ownedDeclared }] = useQueries({
    queries: [
      AttributeQueries.getPartyCertifiedList(tenantId),
      AttributeQueries.getPartyVerifiedList(tenantId),
      AttributeQueries.getPartyDeclaredList(tenantId),
    ],
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

    const hasAllCertifiedAttributes = hasAllDescriptorAttributes(
      'certified',
      ownedCertified.attributes,
      descriptor.attributes.certified
    )

    const hasAllVerifiedAttributes = hasAllDescriptorAttributes(
      'verified',
      ownedVerified.attributes,
      descriptor.attributes.verified,
      descriptor.eservice.producer.id
    )

    const hasAllDeclaredAttributes = hasAllDescriptorAttributes(
      'declared',
      ownedDeclared.attributes,
      descriptor.attributes.declared
    )

    return {
      hasAllCertifiedAttributes,
      hasAllDeclaredAttributes,
      hasAllVerifiedAttributes,
    }
  }, [descriptor, ownedCertified, ownedVerified, ownedDeclared])
}
