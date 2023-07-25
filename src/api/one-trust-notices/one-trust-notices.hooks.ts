import { OneTrustNoticesServices } from './one-trust-notices.services'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import type { ConsentType } from '../api.generatedTypes'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/stores'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'

export enum OneTrustNoticesQueryKeys {
  GetUserConsent = 'GetUserConsent',
  GetNoticeContent = 'GetNoticeContent',
  GetPrivacyPolicy = 'GetPrivacyPolicy',
  GetTermsOfService = 'GetTermsOfService',
}

function useGetUserConsent(consentType: ConsentType) {
  return useQueryWrapper(
    [OneTrustNoticesQueryKeys.GetUserConsent, consentType],
    () => OneTrustNoticesServices.getUserConsent({ consentType }),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )
}

/**
 * This hook will get the content of the notice from the BFF and will be enabled only if the user is logged.
 * This is the default behaviour of the useQueryWrapper hook.
 */
function useGetNoticeContent(consentType: ConsentType) {
  return useQueryWrapper(
    [OneTrustNoticesQueryKeys.GetNoticeContent, consentType],
    () => OneTrustNoticesServices.getNoticeContent({ consentType }),
    {
      suspense: false,
      useErrorBoundary: false,
      retry: false,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )
}

/**
 * This hook will get the content of the notice from the bucket and will be enabled only if the user is not logged.
 * The PP and ToS are public and should be accessible to everyone.
 */
function useGetPublicNoticeContent(consentType: ConsentType) {
  const { sessionToken, isLoadingSessionToken } = useAuth()
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
      enabled: !isLoadingSessionToken && !sessionToken,
    }
  )
}

function useAcceptPrivacyNotice() {
  return useMutationWrapper(OneTrustNoticesServices.acceptPrivacyNotice, {
    suppressSuccessToast: true,
    suppressErrorToast: true,
    suppressLoadingOverlay: true,
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
