import { AgreementQueries } from '@/api/agreement'
import { useDescriptorAttributesPartyOwnership } from '@/hooks/useDescriptorAttributesPartyOwnership'
import type { RequesterEserviceAgreement } from '@/hooks/useGetEServiceConsumerActions'
import {
  canAgreementBeUpgraded,
  getRequesterObsoleteVersionAgreement,
} from '@/utils/agreement.utils'
import { useQuery } from '@tanstack/react-query'

export function useRequesterEserviceAgreement({
  eserviceId,
  activeDescriptorId,
  requesterTenantId,
  isReviewer,
}: {
  eserviceId: string
  activeDescriptorId: string | undefined
  requesterTenantId: string | undefined
  isReviewer: boolean
}): RequesterEserviceAgreement | undefined {
  const consumerAgreementsQuery = useQuery({
    ...AgreementQueries.getConsumerAgreementsList({
      limit: 50,
      offset: 0,
      eservicesIds: [eserviceId],
    }),
    enabled: Boolean(requesterTenantId) && !isReviewer,
    select: ({ results }) => results ?? [],
  })

  const { hasBlockingAgreement, upgradeableAgreementId } = getRequesterObsoleteVersionAgreement(
    consumerAgreementsQuery.data ?? [],
    requesterTenantId
  )

  const { data: upgradeableAgreement } = useQuery({
    ...AgreementQueries.getSingle(upgradeableAgreementId as string),
    enabled: Boolean(upgradeableAgreementId),
  })

  const { hasAllCertifiedAttributes, hasAllDeclaredAttributes, hasAllVerifiedAttributes } =
    useDescriptorAttributesPartyOwnership(
      upgradeableAgreementId ? eserviceId : undefined,
      upgradeableAgreementId ? activeDescriptorId : undefined,
      upgradeableAgreementId ? requesterTenantId : undefined
    )

  return consumerAgreementsQuery.isLoading || hasBlockingAgreement
    ? {
        blocksSubscribe: true,
        upgrade:
          upgradeableAgreement && canAgreementBeUpgraded(upgradeableAgreement)
            ? {
                agreement: upgradeableAgreement,
                hasMissingAttributes: !hasAllDeclaredAttributes || !hasAllVerifiedAttributes,
                hasAllCertifiedAttributes,
              }
            : undefined,
      }
    : undefined
}
