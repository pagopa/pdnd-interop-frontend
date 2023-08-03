import { useTranslation } from 'react-i18next'
import AuthServices from './auth.services'
import { STAGE } from '@/config/env'
import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { parseJwt } from './auth.utils'
import { useMutation } from '@tanstack/react-query'
import { useAuthenticatedQuery } from '../hooks'

export enum AuthQueryKeys {
  GetSessionToken = 'GetSessionToken',
  GetBlacklist = 'GetBlacklist',
}

function useJwt(options?: UseQueryOptions<string | null>) {
  const { data: sessionToken, isLoading: isLoadingSession } = useQuery(
    [AuthQueryKeys.GetSessionToken],
    AuthServices.getSessionToken,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
      ...options,
    }
  )

  return { ...parseJwt(sessionToken), isLoadingSession }
}

function useGetBlacklist() {
  return useAuthenticatedQuery([AuthQueryKeys.GetBlacklist], AuthServices.getBlacklist, {
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
