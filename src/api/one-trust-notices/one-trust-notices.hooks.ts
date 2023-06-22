import { useQuery } from '@tanstack/react-query'
import { OneTrustNoticesServices } from './one-trust-notices.services'
import type { LangCode } from '@/types/common.types'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import type { ConsentType } from '../api.generatedTypes'

export enum OneTrustNoticesQueryKeys {
  GetUserConsent = 'GetUserConsent',
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

function usePrivacyPolicyNotice(lang: LangCode) {
  return useQuery(
    [OneTrustNoticesQueryKeys.GetPrivacyPolicy, lang],
    () => OneTrustNoticesServices.getPrivacyPolicyNotice({ lang }),
    {
      suspense: false,
      useErrorBoundary: false,
      retry: false,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )
}

function useTermsOfServiceNotice(lang: LangCode) {
  return useQuery(
    [OneTrustNoticesQueryKeys.GetTermsOfService, lang],
    () => OneTrustNoticesServices.getTermsOfServiceNotice({ lang }),
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
  usePrivacyPolicyNotice,
  useTermsOfServiceNotice,
}

export const OneTrustNoticesMutations = {
  useAcceptPrivacyNotice,
}
