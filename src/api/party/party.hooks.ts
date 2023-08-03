import { type UseQueryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type {
  GetTenantsParams,
  GetUserInstitutionRelationshipsParams,
  SelfcareInstitution,
  Tenants,
} from '../api.generatedTypes'
import PartyServices from './party.services'
import { AuthHooks } from '../auth'
import { useAuthenticatedQuery } from '../hooks'

export enum PartyQueryKeys {
  GetSingle = 'PartyGetSingle',
  GetPartyUsersList = 'PartyGetPartyUsersList',
  GetTenants = 'PartyGetTenants',
  GetProducts = 'PartyGetProducts',
  GetPartyList = 'PartyGetPartyList',
}

function useGetParty(partyId?: string) {
  return useAuthenticatedQuery(
    [PartyQueryKeys.GetSingle, partyId],
    () => PartyServices.getParty(partyId!),
    {
      enabled: !!partyId,
    }
  )
}

function useGetActiveUserParty() {
  const { jwt } = AuthHooks.useJwt()
  return useGetParty(jwt?.organizationId)
}

function useGetPartyUsersList(
  params: GetUserInstitutionRelationshipsParams,
  config = { suspense: false }
) {
  return useAuthenticatedQuery(
    [PartyQueryKeys.GetPartyUsersList, params],
    () => PartyServices.getPartyUsersList(params),
    {
      enabled: !!params?.tenantId,
      ...config,
    }
  )
}

function usePrefetchUsersList() {
  const queryClient = useQueryClient()

  return (params: GetUserInstitutionRelationshipsParams) => {
    queryClient.prefetchQuery([PartyQueryKeys.GetPartyUsersList, params], () =>
      PartyServices.getPartyUsersList(params)
    )
  }
}

function useGetTenants(params: GetTenantsParams, config: UseQueryOptions<Tenants>) {
  return useAuthenticatedQuery(
    [PartyQueryKeys.GetTenants, params],
    () => PartyServices.getTenants(params),
    config
  )
}

function useGetProducts(config: UseQueryOptions<Array<{ id: string; name: string }>>) {
  return useAuthenticatedQuery(
    [PartyQueryKeys.GetProducts],
    () => PartyServices.getProducts(),
    config
  )
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

function useGetPartyList(config: UseQueryOptions<Array<SelfcareInstitution>>) {
  return useAuthenticatedQuery(
    [PartyQueryKeys.GetPartyList],
    () => PartyServices.getPartyList(),
    config
  )
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
