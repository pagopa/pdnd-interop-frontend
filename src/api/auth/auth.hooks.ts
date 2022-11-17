import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { storageWrite } from '@/utils/storage.utils'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import AuthServices from './auth.services'

export enum AuthQueryKeys {
  SessionToken = 'AuthSessionToken',
}

function useAuthHealthCheck({ enabled }: { enabled: boolean }) {
  return useQueryWrapper([AuthQueryKeys.SessionToken], AuthServices.authHealthCheck, {
    enabled,
  })
}

function useSwapTokens() {
  const { t } = useTranslation('mutations-feedback')
  return useMutationWrapper((identityToken: string) => AuthServices.swapTokens(identityToken), {
    suppressErrorToast: true,
    suppressSuccessToast: true,
    loadingLabel: t('auth.loadingLabel'),
    onSuccess({ session_token }) {
      storageWrite(STORAGE_KEY_SESSION_TOKEN, session_token, 'string')
    },
  })
}

export const AuthServicesHooks = {
  useAuthHealthCheck,
  useSwapTokens,
}
