import { AgreementQueries } from '@/api/agreement'
import { AttributeQueries } from '@/api/attribute'
import { EServiceQueries } from '@/api/eservice'
import { useJwt } from '@/hooks/useJwt'
import { checkEServiceAttributesOwnership } from '@/utils/attribute.utils'
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
    const hasAllDeclaredAndCertifiedAttributes =
      agreement?.state !== 'MISSING_CERTIFIED_ATTRIBUTES' &&
      checkEServiceAttributesOwnership(ownedCertified, descriptor.eservice.attributes.certified) &&
      checkEServiceAttributesOwnership(ownedDeclared, descriptor.eservice.attributes.declared)

    return hasAllDeclaredAndCertifiedAttributes || isProviderSameAsSubscriber
  }, [agreement, descriptor, ownedCertified, ownedDeclared])
}
