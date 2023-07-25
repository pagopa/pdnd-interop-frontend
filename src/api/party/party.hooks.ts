import { useJwt } from '@/hooks/useJwt'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type {
  GetTenantsParams,
  GetUserInstitutionRelationshipsParams,
  SelfcareInstitution,
  Tenants,
} from '../api.generatedTypes'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import { type UseQueryWrapperOptions } from '../react-query-wrappers/react-query-wrappers.types'
import PartyServices from './party.services'

export enum PartyQueryKeys {
  GetSingle = 'PartyGetSingle',
  GetPartyUsersList = 'PartyGetPartyUsersList',
  GetTenants = 'PartyGetTenants',
  GetProducts = 'PartyGetProducts',
  GetPartyList = 'PartyGetPartyList',
}

function useGetParty(partyId?: string) {
  return useQueryWrapper(
    [PartyQueryKeys.GetSingle, partyId],
    () => PartyServices.getParty(partyId!),
    {
      enabled: !!partyId,
    }
  )
}

function useGetActiveUserParty() {
  const { jwt } = useJwt()
  return useGetParty(jwt?.organizationId)
}

function useGetPartyUsersList(
  params: GetUserInstitutionRelationshipsParams,
  config = { suspense: false }
) {
  return useQueryWrapper(
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

function useGetTenants(params: GetTenantsParams, config: UseQueryWrapperOptions<Tenants>) {
  return useQueryWrapper(
    [PartyQueryKeys.GetTenants, params],
    () => PartyServices.getTenants(params),
    config
  )
}

function useGetProducts(config: UseQueryWrapperOptions<Array<{ id: string; name: string }>>) {
  return useQueryWrapper([PartyQueryKeys.GetProducts], () => PartyServices.getProducts(), config)
}

function useUpdateMail() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'party.updateMail' })
  return useMutationWrapper(PartyServices.updateMail, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useGetPartyList(config: UseQueryWrapperOptions<Array<SelfcareInstitution>>) {
  return useQueryWrapper([PartyQueryKeys.GetPartyList], () => PartyServices.getPartyList(), config)
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
