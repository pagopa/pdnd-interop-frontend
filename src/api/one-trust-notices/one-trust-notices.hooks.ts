import { AuthHooks } from '@/api/auth'
import { OneTrustNoticesServices } from './one-trust-notices.services'
import type { ConsentType, PrivacyNotice } from '../api.generatedTypes'
import { type UseQueryOptions, useMutation, useQuery, queryOptions } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'

export enum OneTrustNoticesQueryKeys {
  GetUserConsent = 'GetUserConsent',
  GetNoticeContent = 'GetNoticeContent',
  GetPrivacyPolicy = 'GetPrivacyPolicy',
  GetTermsOfService = 'GetTermsOfService',
}

function useGetUserConsent(consentType: ConsentType, options?: UseQueryOptions<PrivacyNotice>) {
  return useQuery({
    queryKey: [OneTrustNoticesQueryKeys.GetUserConsent, consentType],
    queryFn: () => OneTrustNoticesServices.getUserConsent({ consentType }),
    ...options,
  })
}

export function getUserConsentQueryOptions(consentType: ConsentType) {
  return queryOptions({
    queryKey: [OneTrustNoticesQueryKeys.GetUserConsent, consentType],
    queryFn: () => OneTrustNoticesServices.getUserConsent({ consentType }),
  })
}

/**
 * This hook will get the content of the notice from the BFF and will be enabled only if the user is logged.
 * This is the default behaviour of the useQuery hook.
 */
function useGetNoticeContent(consentType: ConsentType) {
  const { jwt, isLoadingSession } = AuthHooks.useJwt()
  return useQuery({
    queryKey: [OneTrustNoticesQueryKeys.GetNoticeContent, consentType],
    queryFn: () => OneTrustNoticesServices.getNoticeContent({ consentType }),
    suspense: false,
    useErrorBoundary: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: !!jwt && !isLoadingSession,
  })
}

/**
 * This hook will get the content of the notice from the bucket and will be enabled only if the user is not logged.
 * The PP and ToS are public and should be accessible to everyone.
 */
function useGetPublicNoticeContent(consentType: ConsentType) {
  const { jwt, isLoadingSession } = AuthHooks.useJwt()
  const lang = useCurrentLanguage()

  return useQuery({
    queryKey: [OneTrustNoticesQueryKeys.GetNoticeContent, consentType],
    queryFn: () =>
      OneTrustNoticesServices.getPublicNoticeContent({
        consentType: consentType.toLowerCase() as Lowercase<ConsentType>,
        lang,
      }),
    suspense: false,
    useErrorBoundary: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: !jwt && !isLoadingSession,
  })
}

function useAcceptPrivacyNotice() {
  return useMutation({
    mutationFn: OneTrustNoticesServices.acceptPrivacyNotice,
  })
}

export const OneTrustNoticesQueries = {
  useGetUserConsent,
  useGetNoticeContent,
  useGetPublicNoticeContent,
}

export const OneTrustNoticesMutations = {
  useAcceptPrivacyNotice,
}
