import { useJwt } from '@/hooks/useJwt'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import type { PartyGetUsersListUrlParams } from './party.api.types'
import PartyServices from './party.services'

export enum PartyQueryKeys {
  GetSingle = 'PartyGetSingle',
  GetUsersList = 'PartyGetUsersList',
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
  return useMutationWrapper(PartyServices.updateMail, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

export const PartyQueries = {
  useGetParty,
  useGetActiveUserParty,
  useGetUsersList,
  usePrefetchUsersList,
}

export const PartyMutations = {
  useUpdateMail,
}
