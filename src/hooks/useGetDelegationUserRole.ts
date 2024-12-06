import { DelegationQueries } from '@/api/delegation'
import { useQuery } from '@tanstack/react-query'

export function useGetDelegationUserRole({
  eserviceId,
  organizationId,
}: {
  eserviceId: string
  organizationId: string | undefined
}) {
  const { data: producerDelegations } = useQuery({
    ...DelegationQueries.getProducerDelegationsList({
      eserviceIds: [eserviceId],
      states: ['ACTIVE'],
      kind: 'DELEGATED_PRODUCER',
      offset: 0,
      limit: 50,
    }),
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
