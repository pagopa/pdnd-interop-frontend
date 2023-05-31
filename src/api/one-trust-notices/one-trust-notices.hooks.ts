import { useQuery } from '@tanstack/react-query'
import { OneTrustNoticesServices } from './one-trust-notices.services'
import type { LangCode } from '@/types/common.types'

export enum OneTrustNoticesQueryKeys {
  GetPrivacyPolicy = 'GetPrivacyPolicy',
  GetTermsOfService = 'GetTermsOfService',
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

export const OneTrustNoticesQueries = {
  usePrivacyPolicyNotice,
  useTermsOfServiceNotice,
}
