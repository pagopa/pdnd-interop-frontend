import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import AuthServices from './auth.services'
import { STAGE } from '@/config/env'
import { useQuery } from '@tanstack/react-query'
import { parseJwt } from './auth.utils'
import type { UseQueryWrapperOptions } from '../react-query-wrappers/react-query-wrappers.types'

export enum AuthQueryKeys {
  GetSessionToken = 'GetSessionToken',
  GetBlacklist = 'GetBlacklist',
}

function useJwt(options?: UseQueryWrapperOptions<string | null>) {
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
  return useQueryWrapper([AuthQueryKeys.GetBlacklist], AuthServices.getBlacklist, {
    suspense: false,
    enabled: STAGE === 'PROD',
    useErrorBoundary: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}

function useSwapSAMLTokens() {
  const { t } = useTranslation('mutations-feedback')
  return useMutationWrapper(AuthServices.swapSAMLToken, {
    suppressErrorToast: true,
    suppressSuccessToast: true,
    loadingLabel: t('auth.loadingLabel'),
  })
}

export const AuthHooks = {
  useJwt,
  useGetBlacklist,
  useSwapSAMLTokens,
}
