import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL, TEMP_USER_BLACKLIST_URL } from '@/config/env'
import axios from 'axios'
import type { SAMLTokenRequest, SessionToken } from '../api.generatedTypes'

async function getBlacklist() {
  const response = await axios.get<string[]>(TEMP_USER_BLACKLIST_URL)
  return response.data
}

async function swapTokens(identity_token: string) {
  const response = await axiosInstance.post<{ session_token: string }>(
    `${BACKEND_FOR_FRONTEND_URL}/session/tokens`,
    { identity_token }
  )
  return response.data
}

async function swapSAMLToken(payload: SAMLTokenRequest) {
  const response = await axiosInstance.post<SessionToken>(
    `${BACKEND_FOR_FRONTEND_URL}/session/saml2/tokens`,
    payload
  )

  return response.data
}

function authHealthCheck() {
  return axiosInstance.get(`${BACKEND_FOR_FRONTEND_URL}/status`)
}

const AuthServices = {
  getBlacklist,
  swapTokens,
  swapSAMLToken,
  authHealthCheck,
}

export default AuthServices
