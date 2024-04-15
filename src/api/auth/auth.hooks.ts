import { useTranslation } from 'react-i18next'
import AuthServices from './auth.services'
import { STAGE } from '@/config/env'
import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import type { ParsedJwt } from './auth.utils'
import { useMutation } from '@tanstack/react-query'

export enum AuthQueryKeys {
  GetSessionToken = 'GetSessionToken',
  GetBlacklist = 'GetBlacklist',
}

function useJwt(config?: UseQueryOptions<ParsedJwt | null>) {
  const { data: sessionToken, isLoading: isLoadingSession } = useQuery({
    queryKey: [AuthQueryKeys.GetSessionToken],
    queryFn: AuthServices.getSessionToken,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: false,
    ...config,
  })

  return { ...(sessionToken as ParsedJwt), isLoadingSession }
}

function useGetBlacklist() {
  return useQuery({
    queryKey: [AuthQueryKeys.GetBlacklist],
    queryFn: AuthServices.getBlacklist,
    suspense: false,
    enabled: STAGE === 'PROD',
    useErrorBoundary: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
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
