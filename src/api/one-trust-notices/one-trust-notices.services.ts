import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { ConsentType, PrivacyNotice, PrivacyNoticeSeed } from '../api.generatedTypes'
import axiosInstance from '@/config/axios'
import type { LangCode, OneTrustContent } from '@/types/common.types'

async function getUserConsent({ consentType }: { consentType: ConsentType }) {
  const response = await axiosInstance.get<PrivacyNotice>(
    `${BACKEND_FOR_FRONTEND_URL}/user/consent/${consentType}`
  )
  return response.data
}

async function getNoticeContent({ consentType }: { consentType: ConsentType }) {
  const response = await axiosInstance.get<OneTrustContent.Node>(
    `${BACKEND_FOR_FRONTEND_URL}/privacyNotices/${consentType}`
  )
  return response.data
}

/**
 * This service is used to get directly the content of the notice from the bucket without
 * relying on the BFF. This is because the BFF is not able to get the content of the notice
 * for non-logged users, but the notice is public and should be accessible to everyone.
 */
async function getPublicNoticeContent({
  consentType,
  lang,
}: {
  consentType: Lowercase<ConsentType>
  lang: LangCode
}) {
  const response = await axiosInstance.get<OneTrustContent.Node>(
    `${window.location.origin}/consent/latest/${lang}/${consentType}.json`
  )
  return response.data
}

async function acceptPrivacyNotice({
  consentType,
  ...payload
}: { consentType: ConsentType } & PrivacyNoticeSeed) {
  return axiosInstance.post(`${BACKEND_FOR_FRONTEND_URL}/user/consent/${consentType}`, payload)
}

export const OneTrustNoticesServices = {
  getUserConsent,
  getNoticeContent,
  getPublicNoticeContent,
  acceptPrivacyNotice,
}
