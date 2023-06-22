import { BACKEND_FOR_FRONTEND_URL, INTEROP_RESOURCES_BASE_URL } from '@/config/env'
import type { LangCode, OneTrustContent } from '@/types/common.types'
import axios from 'axios'
import type { ConsentType, PrivacyNotice, PrivacyNoticeSeed } from '../api.generatedTypes'
import axiosInstance from '@/config/axios'

async function getUserConsent({ consentType }: { consentType: ConsentType }) {
  const response = await axiosInstance.get<PrivacyNotice>(
    `${BACKEND_FOR_FRONTEND_URL}/user/consent/${consentType}`
  )
  return response.data
}

async function getPrivacyPolicyNotice({ lang }: { lang: LangCode }) {
  const response = await axios.get<OneTrustContent.RootNode>(
    `${INTEROP_RESOURCES_BASE_URL}/one-trust-notices/privacy-policy-${lang}.json`
  )
  return response.data
}

async function getTermsOfServiceNotice({ lang }: { lang: LangCode }) {
  const response = await axios.get<OneTrustContent.RootNode>(
    `${INTEROP_RESOURCES_BASE_URL}/one-trust-notices/terms-of-service-${lang}.json`
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
  getPrivacyPolicyNotice,
  getTermsOfServiceNotice,
  acceptPrivacyNotice,
}
