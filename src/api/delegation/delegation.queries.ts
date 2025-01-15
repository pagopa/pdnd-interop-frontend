import { queryOptions } from '@tanstack/react-query'
import type { GetConsumerDelegatorsParams, GetDelegationsParams } from '../api.generatedTypes'
import { DelegationServices } from './delegation.services'

function getDelegationsList(params: GetDelegationsParams) {
  return queryOptions({
    queryKey: ['DelegationGetDelegationsList', params],
    queryFn: () => DelegationServices.getDelegations(params),
  })
}

function getSingle({ delegationId }: { delegationId: string }) {
  return queryOptions({
    queryKey: ['DelegationGetSingle', delegationId],
    queryFn: () => DelegationServices.getSingle({ delegationId }),
  })
}

function getConsumerDelegators(params: GetConsumerDelegatorsParams) {
  return queryOptions({
    queryKey: ['DelegationGetConsumerDelegators', params],
    queryFn: () => DelegationServices.getConsumerDelegators(params),
  })
}

export const DelegationQueries = {
  getDelegationsList,
  getSingle,
  getConsumerDelegators,
}
