import { AuthHooks } from '@/api/auth'
import { OneTrustNoticesServices } from './one-trust-notices.services'
import type { ConsentType, PrivacyNotice } from '../api.generatedTypes'
import { type UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useAuthenticatedQuery } from '../hooks'

export enum OneTrustNoticesQueryKeys {
  GetUserConsent = 'GetUserConsent',
  GetNoticeContent = 'GetNoticeContent',
  GetPrivacyPolicy = 'GetPrivacyPolicy',
  GetTermsOfService = 'GetTermsOfService',
}

function useGetUserConsent(consentType: ConsentType, options?: UseQueryOptions<PrivacyNotice>) {
  return useAuthenticatedQuery(
    [OneTrustNoticesQueryKeys.GetUserConsent, consentType],
    () => OneTrustNoticesServices.getUserConsent({ consentType }),
    {
      ...options,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )
}

/**
 * This hook will get the content of the notice from the BFF and will be enabled only if the user is logged.
 * This is the default behaviour of the useAuthenticatedQuery hook.
 */
function useGetNoticeContent(consentType: ConsentType) {
  const { jwt, isLoadingSession } = AuthHooks.useJwt()
  return useAuthenticatedQuery(
    [OneTrustNoticesQueryKeys.GetNoticeContent, consentType],
    () => OneTrustNoticesServices.getNoticeContent({ consentType }),
    {
      suspense: false,
      useErrorBoundary: false,
      retry: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: !!jwt && !isLoadingSession,
    }
  )
}

/**
 * This hook will get the content of the notice from the bucket and will be enabled only if the user is not logged.
 * The PP and ToS are public and should be accessible to everyone.
 */
function useGetPublicNoticeContent(consentType: ConsentType) {
  const { jwt, isLoadingSession } = AuthHooks.useJwt()
  const lang = useCurrentLanguage()

  return useQuery(
    [OneTrustNoticesQueryKeys.GetNoticeContent, consentType],
    () =>
      OneTrustNoticesServices.getPublicNoticeContent({
        consentType: consentType.toLowerCase() as Lowercase<ConsentType>,
        lang,
      }),
    {
      suspense: false,
      useErrorBoundary: false,
      retry: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: !jwt && !isLoadingSession,
    }
  )
}

function useAcceptPrivacyNotice() {
  return useMutation(OneTrustNoticesServices.acceptPrivacyNotice, {})
}

export const OneTrustNoticesQueries = {
  useGetUserConsent,
  useGetNoticeContent,
  useGetPublicNoticeContent,
}

export const OneTrustNoticesMutations = {
  useAcceptPrivacyNotice,
}
