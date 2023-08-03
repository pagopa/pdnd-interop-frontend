import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import AuthServices from './auth.services'
import { STAGE } from '@/config/env'
import { useCurrentRoute } from '@/router'
import { useQuery } from '@tanstack/react-query'

export enum AuthQueryKeys {
  GetSessionToken = 'GetSessionToken',
  GetBlacklist = 'GetBlacklist',
}

function useGetSessionToken() {
  const { isPublic } = useCurrentRoute()

  return useQuery([AuthQueryKeys.GetSessionToken], AuthServices.getSessionToken, {
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: false,
    enabled: !isPublic,
  })
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
  useGetSessionToken,
  useGetBlacklist,
  useSwapSAMLTokens,
}
