import { AgreementQueries } from '@/api/agreement'
import { AttributeQueries } from '@/api/attribute'
import { EServiceQueries } from '@/api/eservice'
import { useJwt } from '@/hooks/useJwt'
import { checkEServiceAttributesOwnership } from '@/utils/attribute.utils'
import React from 'react'

export default function useCanUserSubmitAgreementDraft(agreementId: string) {
  const { jwt } = useJwt()
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId, { suspense: false })
  const { data: eservice } = EServiceQueries.useGetSingle(
    agreement?.eservice.id,
    agreement?.descriptorId,
    { suspense: false }
  )

  const [{ data: ownedCertified }, , { data: ownedDeclared }] = AttributeQueries.useGetListParty(
    jwt?.organizationId,
    agreement?.producer.id,
    {
      suspense: false,
    }
  )

  return React.useMemo(() => {
    if (!agreement || !eservice || !ownedCertified || !ownedDeclared) return false

    const isProviderSameAsSubscriber = agreement.consumer.id === agreement.producer.id
    const hasAllDeclaredAndCertifiedAttributes =
      agreement?.state !== 'MISSING_CERTIFIED_ATTRIBUTES' &&
      checkEServiceAttributesOwnership(ownedCertified, eservice.attributes.certified) &&
      checkEServiceAttributesOwnership(ownedDeclared, eservice.attributes.declared)

    return hasAllDeclaredAndCertifiedAttributes || isProviderSameAsSubscriber
  }, [agreement, eservice, ownedCertified, ownedDeclared])
}
