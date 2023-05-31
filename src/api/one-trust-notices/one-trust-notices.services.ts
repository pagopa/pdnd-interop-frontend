import { INTEROP_RESOURCES_BASE_URL } from '@/config/env'
import type { LangCode } from '@/types/common.types'
import type { RootNode } from '@/utils/parser'
import axios from 'axios'

async function getPrivacyPolicyNotice({ lang }: { lang: LangCode }) {
  const response = await axios.get<RootNode>(
    `${INTEROP_RESOURCES_BASE_URL}/one-trust-notices/privacy-policy-${lang}.json`
  )
  return response.data
}

async function getTermsOfServiceNotice({ lang }: { lang: LangCode }) {
  const response = await axios.get<RootNode>(
    `${INTEROP_RESOURCES_BASE_URL}/one-trust-notices/terms-of-service-${lang}.json`
  )
  return response.data
}

export const OneTrustNoticesServices = {
  getPrivacyPolicyNotice,
  getTermsOfServiceNotice,
}
