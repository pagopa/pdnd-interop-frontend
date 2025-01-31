import { queryOptions } from '@tanstack/react-query'
import type { GetConsumerDelegatorsParams, GetDelegationsParams } from '../api.generatedTypes'
import { DelegationServices } from './delegation.services'

function getList(params: GetDelegationsParams) {
  return queryOptions({
    queryKey: ['DelegationGetDelegationsList', params],
    queryFn: () => DelegationServices.getList(params),
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
  getList,
  getSingle,
  getConsumerDelegators,
}
