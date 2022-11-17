import { useQueryClient } from '@tanstack/react-query'
import { useQueryWrapper } from '../react-query-wrappers'
import { PartyGetUsersListUrlParams } from './party.api.types'
import PartyServices from './party.services'

export enum PartyQueryKeys {
  GetUsersList = 'PartyGetUsersList',
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
    queryClient.prefetchQuery(
      [PartyQueryKeys.GetUsersList, partyId, params],
      () => PartyServices.getUsersList(partyId, params),
      {
        staleTime: 180000,
      }
    )
  }
}

export const PartyQueries = {
  useGetUsersList,
  usePrefetchUsersList,
}
