import { type UseQueryOptions, useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type {
  GetInstitutionUsersParams,
  GetTenantsParams,
  SelfcareInstitution,
  Tenants,
} from '../api.generatedTypes'
import PartyServices from './party.services'
import { AuthHooks } from '../auth'

export enum PartyQueryKeys {
  GetSingle = 'PartyGetSingle',
  GetPartyUsersList = 'PartyGetPartyUsersList',
  GetTenants = 'PartyGetTenants',
  GetProducts = 'PartyGetProducts',
  GetPartyList = 'PartyGetPartyList',
}

function useGetParty(partyId?: string) {
  return useQuery({
    queryKey: [PartyQueryKeys.GetSingle, partyId],
    queryFn: () => PartyServices.getParty(partyId!),
    enabled: !!partyId,
  })
}

function useGetActiveUserParty() {
  const { jwt } = AuthHooks.useJwt()
  return useGetParty(jwt?.organizationId)
}

function useGetPartyUsersList(params: GetInstitutionUsersParams, config = { suspense: false }) {
  return useQuery({
    queryKey: [PartyQueryKeys.GetPartyUsersList, params],
    queryFn: () => PartyServices.getPartyUsersList(params),
    enabled: !!params?.tenantId,
    ...config,
  })
}

function usePrefetchUsersList() {
  const queryClient = useQueryClient()

  return (params: GetInstitutionUsersParams) => {
    queryClient.prefetchQuery([PartyQueryKeys.GetPartyUsersList, params], () =>
      PartyServices.getPartyUsersList(params)
    )
  }
}

function useGetTenants(params: GetTenantsParams, config: UseQueryOptions<Tenants>) {
  return useQuery({
    queryKey: [PartyQueryKeys.GetTenants, params],
    queryFn: () => PartyServices.getTenants(params),
    ...config,
  })
}

/**
 * getProducts and getPartyList are using internally selfcare apis.
 * We use `useErrorBoundary: false` to avoid the error boundary to catch the error and show the error page in case of error.
 * This is because we don't want to compromise the user experience in case of unavailability of an external service.
 */

function useGetProducts(config: UseQueryOptions<Array<{ id: string; name: string }>>) {
  return useQuery({
    queryKey: [PartyQueryKeys.GetProducts],
    queryFn: () => PartyServices.getProducts(),
    useErrorBoundary: false,
    suspense: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    ...config,
  })
}

function useGetPartyList(config: UseQueryOptions<Array<SelfcareInstitution>>) {
  return useQuery({
    queryKey: [PartyQueryKeys.GetPartyList],
    queryFn: () => PartyServices.getPartyList(),
    useErrorBoundary: false,
    suspense: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    ...config,
  })
}

function useUpdateMail() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'party.updateMail' })
  return useMutation(PartyServices.updateMail, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const PartyQueries = {
  useGetParty,
  useGetTenants,
  useGetActiveUserParty,
  useGetPartyUsersList,
  usePrefetchUsersList,
  useGetProducts,
  useGetPartyList,
}

export const PartyMutations = {
  useUpdateMail,
}
