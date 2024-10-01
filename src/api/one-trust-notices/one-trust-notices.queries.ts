import { OneTrustNoticesServices } from './one-trust-notices.services'
import type { ConsentType } from '../api.generatedTypes'
import { queryOptions } from '@tanstack/react-query'
import type { LangCode } from '@/types/common.types'

export enum OneTrustNoticesQueryKeys {
  GetUserConsent = 'GetUserConsent',
  GetNoticeContent = 'GetNoticeContent',
}

function getUserConsent(consentType: ConsentType) {
  return queryOptions({
    queryKey: ['GetUserConsent', consentType],
    queryFn: () => OneTrustNoticesServices.getUserConsent({ consentType }),
  })
}

/**
 * This query will get the content of the notice from the BFF and will be enabled only if the user is logged.
 * This is the default behaviour of the useQuery hook.
 */
function getNoticeContent({
  consentType,
  isAuthenticated,
}: {
  consentType: ConsentType
  isAuthenticated: boolean
}) {
  return queryOptions({
    queryKey: ['GetNoticeContent', consentType],
    queryFn: () => OneTrustNoticesServices.getNoticeContent({ consentType }),
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: isAuthenticated,
  })
}

/**
 * This query will get the content of the notice from the bucket and will be enabled only if the user is not logged.
 * The PP and ToS are public and should be accessible to everyone.
 */
function getPublicNoticeContent({
  consentType,
  isAuthenticated,
  lang,
}: {
  consentType: ConsentType
  isAuthenticated: boolean
  lang: LangCode
}) {
  return queryOptions({
    queryKey: ['GetNoticeContent', consentType],
    queryFn: () =>
      OneTrustNoticesServices.getPublicNoticeContent({
        consentType: consentType.toLowerCase() as Lowercase<ConsentType>,
        lang,
      }),
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !isAuthenticated,
  })
}

export const OneTrustNoticesQueries = {
  getUserConsent,
  getNoticeContent,
  getPublicNoticeContent,
}
