import { useJwt } from '@/hooks/useJwt'
import { EServiceDescriptorCatalog, EServiceDescriptorProvider } from '@/types/eservice.types'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { EServiceQueryKeys } from '../eservice'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import { PartyGetUsersListUrlParams } from './party.api.types'
import PartyServices from './party.services'
import {
  updateDescriptorCatalogPartyMailCache,
  updateDescriptorProviderPartyMailCache,
} from './party.utils'

export enum PartyQueryKeys {
  GetUsersList = 'PartyGetUsersList',
}

function useGetUser(partyId?: string) {
  return useQueryWrapper(
    [PartyQueryKeys.GetUsersList, partyId],
    () => PartyServices.getUser(partyId!),
    {
      enabled: !!partyId,
    }
  )
}

function useGetActiveUser() {
  const { jwt } = useJwt()
  return useGetUser(jwt?.organizationId)
}

function useGetUsersList(
  partyId?: string,
  params?: PartyGetUsersListUrlParams,
  config = { suspense: false }
) {
  return useQueryWrapper(
    [PartyQueryKeys.GetUsersList, partyId, params],
    () => PartyServices.getUsersList(partyId!, params),
    {
      enabled: !!partyId,
      ...config,
    }
  )
}

function usePrefetchUsersList() {
  const queryClient = useQueryClient()

  return (partyId?: string, params?: PartyGetUsersListUrlParams) => {
    if (!partyId) return
    queryClient.prefetchQuery([PartyQueryKeys.GetUsersList, partyId, params], () =>
      PartyServices.getUsersList(partyId, params)
    )
  }
}

function useUpdateMail() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'party.updateMail' })
  const queryClient = useQueryClient()

  return useMutationWrapper(PartyServices.updateMail, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    onSuccess(_, { contactEmail, description }) {
      queryClient.setQueriesData<EServiceDescriptorCatalog>(
        [EServiceQueryKeys.GetDescriptorCatalog],
        updateDescriptorCatalogPartyMailCache.bind(null, { address: contactEmail, description })
      )
      queryClient.setQueriesData<EServiceDescriptorProvider>(
        [EServiceQueryKeys.GetDescriptorProvider],
        updateDescriptorProviderPartyMailCache.bind(null, { address: contactEmail, description })
      )
    },
  })
}

export const PartyQueries = {
  useGetUser,
  useGetActiveUser,
  useGetUsersList,
  usePrefetchUsersList,
}

export const PartyMutations = {
  useUpdateMail,
}
