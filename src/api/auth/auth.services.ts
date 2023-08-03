import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL, TEMP_USER_BLACKLIST_URL } from '@/config/env'
import axios from 'axios'
import type { SAMLTokenRequest, SessionToken } from '../api.generatedTypes'
import { MOCK_TOKEN, STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { TokenExchangeError } from '@/utils/errors.utils'

async function swapTokens(identity_token: string) {
  const response = await axiosInstance.post<{ session_token: string }>(
    `${BACKEND_FOR_FRONTEND_URL}/session/tokens`,
    { identity_token }
  )
  return response.data
}

async function getSessionToken(): Promise<string> {
  const resolveToken = (sessionToken: string) => {
    window.localStorage.setItem(STORAGE_KEY_SESSION_TOKEN, sessionToken)
    return sessionToken
  }

  // 1. Check if there is a mock token: only used for dev purposes
  if (MOCK_TOKEN) return resolveToken(MOCK_TOKEN)

  // 2. See if we are coming from Self Care and have a new token
  const hasSelfCareIdentityToken = window.location.hash.includes('#id=')
  if (hasSelfCareIdentityToken) {
    const selfCareIdentityToken = window.location.hash.replace('#id=', '')
    // Remove token from hash
    history.replaceState({}, document.title, window.location.href.split('#')[0])
    try {
      const result = await swapTokens(selfCareIdentityToken)
      return resolveToken(result.session_token)
    } catch (err) {
      throw new TokenExchangeError()
    }
  }

  // 3. See if we are trying to login as support operator
  // If the url has contains saml2 and jwt, we are trying to login as support operator
  const hasSupportOperatorToken =
    window.location.hash.includes('#saml2=') && window.location.hash.includes('jwt=')
  if (hasSupportOperatorToken) {
    const supportOperatorToken = window.location.hash.split('jwt=')[1]
    return resolveToken(supportOperatorToken)
  }

  // 4. Check if there is a valid token in the storage already
  const sessionStorageToken = window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)
  if (sessionStorageToken) {
    return resolveToken(sessionStorageToken)
  }

  throw new TokenExchangeError()
}

async function swapSAMLToken(payload: SAMLTokenRequest) {
  const response = await axiosInstance.post<SessionToken>(
    `${BACKEND_FOR_FRONTEND_URL}/session/saml2/tokens`,
    payload
  )

  return response.data
}

async function getBlacklist() {
  const response = await axios.get<string[]>(TEMP_USER_BLACKLIST_URL)
  return response.data
}

const AuthServices = {
  getSessionToken,
  getBlacklist,
  swapSAMLToken,
}

export default AuthServices
