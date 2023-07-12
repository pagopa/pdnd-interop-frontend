import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { ConsentType, PrivacyNotice, PrivacyNoticeSeed } from '../api.generatedTypes'
import axiosInstance from '@/config/axios'
import type { OneTrustContent } from '@/types/common.types'

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

async function acceptPrivacyNotice({
  consentType,
  ...payload
}: { consentType: ConsentType } & PrivacyNoticeSeed) {
  return axiosInstance.post(`${BACKEND_FOR_FRONTEND_URL}/user/consent/${consentType}`, payload)
}

export const OneTrustNoticesServices = {
  getUserConsent,
  getNoticeContent,
  acceptPrivacyNotice,
}
