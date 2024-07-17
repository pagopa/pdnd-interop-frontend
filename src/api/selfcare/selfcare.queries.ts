import { queryOptions } from '@tanstack/react-query'
import { SelfcareServices } from './selfcare.services'

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

export const PartyQueries = {
  getProducts,
  getPartyList,
}
