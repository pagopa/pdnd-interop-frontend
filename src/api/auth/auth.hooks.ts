import { useTranslation } from 'react-i18next'
import AuthServices from './auth.services'
import { STAGE } from '@/config/env'
import { type UseQueryOptions, useQuery, queryOptions } from '@tanstack/react-query'
import { parseJwt } from './auth.utils'
import { useMutation } from '@tanstack/react-query'

export enum AuthQueryKeys {
  GetSessionToken = 'GetSessionToken',
  GetBlacklist = 'GetBlacklist',
}

function useJwt(config?: UseQueryOptions<string | null>) {
  const { data: sessionToken, isLoading: isLoadingSession } = useQuery({
    queryKey: [AuthQueryKeys.GetSessionToken],
    queryFn: AuthServices.getSessionToken,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    ...config,
  })

  return { ...parseJwt(sessionToken), isLoadingSession }
}

export function jwtQueryOptions() {
  return queryOptions({
    queryKey: [AuthQueryKeys.GetSessionToken],
    queryFn: async () => {
      const jwt = await AuthServices.getSessionToken()
      return parseJwt(jwt)
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  })
}

function useGetBlacklist() {
  return useQuery({
    queryKey: [AuthQueryKeys.GetBlacklist],
    queryFn: AuthServices.getBlacklist,
    enabled: STAGE === 'PROD',
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

function useSwapSAMLTokens() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'auth' })
  return useMutation(AuthServices.swapSAMLToken, {
    meta: {
      loadingLabel: t('loadingLabel'),
    },
  })
}

export const AuthHooks = {
  useJwt,
  useGetBlacklist,
  useSwapSAMLTokens,
}
