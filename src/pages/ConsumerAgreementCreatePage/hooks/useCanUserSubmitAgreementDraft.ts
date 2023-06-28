import { AgreementQueries } from '@/api/agreement'
import { AttributeQueries } from '@/api/attribute'
import { EServiceQueries } from '@/api/eservice'
import { useJwt } from '@/hooks/useJwt'
import { hasAllEServiceAttributes, remapDescriptorAttributes } from '@/utils/attribute.utils'
import React from 'react'

export default function useCanUserSubmitAgreementDraft(agreementId: string) {
  const { jwt } = useJwt()
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId, { suspense: false })
  // This should not stay here, waiting to get the attributes from the agreement itself
  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(
    agreement?.eservice.id as string,
    agreement?.descriptorId as string,
    { enabled: !!(agreement?.eservice.id && agreement?.descriptorId), suspense: false }
  )

  const [{ data: ownedCertified }, , { data: ownedDeclared }] = AttributeQueries.useGetListParty(
    jwt?.organizationId,
    agreement?.producer.id,
    {
      suspense: false,
    }
  )

  return React.useMemo(() => {
    if (!agreement || !descriptor || !ownedCertified || !ownedDeclared) return false

    const isProviderSameAsSubscriber = agreement.consumer.id === agreement.producer.id
    const remapedEServiceAttributes = remapDescriptorAttributes(descriptor.attributes)

    const hasAllCertifiedAttributes =
      agreement?.state !== 'MISSING_CERTIFIED_ATTRIBUTES' &&
      hasAllEServiceAttributes(
        'certified',
        ownedCertified.attributes,
        remapedEServiceAttributes.certified
      )

    const hasAllDeclaredAttributes = hasAllEServiceAttributes(
      'declared',
      ownedDeclared.attributes,
      remapedEServiceAttributes.declared
    )

    /**
     * If the provider is the same as the subscriber, we don't need to check for attributes
     */
    return isProviderSameAsSubscriber || (hasAllCertifiedAttributes && hasAllDeclaredAttributes)
  }, [agreement, descriptor, ownedCertified, ownedDeclared])
}
