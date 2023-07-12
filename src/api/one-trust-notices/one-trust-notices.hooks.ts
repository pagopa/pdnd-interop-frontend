import { OneTrustNoticesServices } from './one-trust-notices.services'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import type { ConsentType } from '../api.generatedTypes'

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
}

export const OneTrustNoticesMutations = {
  useAcceptPrivacyNotice,
}
