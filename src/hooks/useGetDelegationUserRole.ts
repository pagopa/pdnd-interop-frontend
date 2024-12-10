import { DelegationQueries } from '@/api/delegation'
import { useQuery } from '@tanstack/react-query'

export function useGetDelegationUserRole({
  eserviceId,
  organizationId,
}: {
  eserviceId: string | undefined
  organizationId: string | undefined
}) {
  const { data: producerDelegations } = useQuery({
    ...DelegationQueries.getProducerDelegationsList({
      eserviceIds: [eserviceId as string],
      states: ['ACTIVE'],
      kind: 'DELEGATED_PRODUCER',
      offset: 0,
      limit: 50,
    }),
    enabled: Boolean(eserviceId),
    select: (delegations) => delegations.results,
  })

  const isDelegate = Boolean(
    organizationId &&
      producerDelegations?.find((delegation) => delegation.delegate.id === organizationId)
  )

  const isDelegator = Boolean(
    organizationId &&
      producerDelegations?.find((delegation) => delegation.delegator.id === organizationId)
  )

  return {
    isDelegate,
    isDelegator,
    producerDelegations,
  }
}
