import { queryOptions } from '@tanstack/react-query'
import { SelfcareServices } from './selfcare.services'
import type { UserProductRole } from '@/types/party.types'

function getProducts() {
  return queryOptions({
    queryKey: ['SelfcareGetProducts'],
    queryFn: () => SelfcareServices.getProducts(),
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

function getPartyList() {
  return queryOptions({
    queryKey: ['SelfcareGetPartyList'],
    queryFn: () => SelfcareServices.getPartyList(),
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

function getSingleUser(userId: string) {
  return queryOptions({
    queryKey: ['SelfcareGetSingleUser', userId],
    queryFn: () => SelfcareServices.getSingleUser(userId),
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

function getUsersByRole(params: { tenantId: string; role: UserProductRole }) {
  return queryOptions({
    queryKey: ['SelfcareGetUsersByRole', params.tenantId, params.role],
    queryFn: () => SelfcareServices.getUsersByRole(params),
    throwOnError: false,
    retry: false,
  })
}

export const SelfcareQueries = {
  getProducts,
  getPartyList,
  getSingleUser,
  getUsersByRole,
}
