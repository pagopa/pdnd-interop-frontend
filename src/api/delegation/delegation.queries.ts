import { queryOptions } from '@tanstack/react-query'
import type { GetDelegationsParams } from '../api.generatedTypes'
import { DelegationServices } from './delegation.services'

function getProducerDelegationsList(params: GetDelegationsParams) {
  return queryOptions({
    queryKey: ['DelegationGetProducerDelegationsList', params],
    queryFn: () => DelegationServices.getProducerDelegations(params),
  })
}

function getSingle({ delegationId }: { delegationId: string }) {
  return queryOptions({
    queryKey: ['DelegationGetSingle', delegationId],
    queryFn: () => DelegationServices.getSingle({ delegationId }),
  })
}

export const DelegationQueries = {
  getProducerDelegationsList,
  getSingle,
}
