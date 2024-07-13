import AuthServices from '@/api/auth/auth.services'
import { MOCK_TOKEN, STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { PRODUCER_ALLOWED_ORIGINS, isDevelopment } from '@/config/env'
import type { JwtUser } from '@/types/party.types'
import { hasSessionExpired, waitFor } from '@/utils/common.utils'
import { TokenExchangeError } from '@/utils/errors.utils'
import React from 'react'
import { match, P } from 'ts-pattern'

export interface AuthContext {
  isAuthenticated: boolean
  user: ReturnType<typeof parseJwt> | null
}

const AuthContext = React.createContext<AuthContext | null>(null)

function retrieveUserFromSessionToken() {
  return match(window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN))
    .with(P.nonNullable, (jwt) => {
      try {
        return parseJwt(jwt)
      } catch {
        return null
      }
    })
    .otherwise(() => {
      return null
    })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<ReturnType<typeof parseJwt> | null>(
    retrieveUserFromSessionToken
  )
  const isAuthenticated = Boolean(user && !hasSessionExpired(user.exp))

  React.useEffect(() => {
    function callback(event: StorageEvent) {
      if (event.key === STORAGE_KEY_SESSION_TOKEN) {
        const newUser = retrieveUserFromSessionToken()
        setUser(newUser)
      }
    }

    window.addEventListener('storage', callback)
    return () => {
      window.removeEventListener('storage', callback)
    }
  }, [])

  return <AuthContext.Provider value={{ isAuthenticated, user }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function parseJwt(token: string) {
  const jwt = JSON.parse(window.atob(token.split('.')[1])) as JwtUser
  const currentRoles = jwt.organization.roles.map((r) => r.role)
  const isAdmin = currentRoles.length === 1 && currentRoles[0] === 'admin'
  const isOperatorAPI = currentRoles.includes('api')
  const isOperatorSecurity = currentRoles.includes('security')
  const isSupport = currentRoles.includes('support')
  const isOrganizationAllowedToProduce = !!(
    jwt.externalId && PRODUCER_ALLOWED_ORIGINS.includes(jwt.externalId.origin)
  )

  return {
    ...jwt,
    currentRoles,
    isAdmin,
    isOperatorAPI,
    isOperatorSecurity,
    isSupport,
    isOrganizationAllowedToProduce,
  }
}

export async function authenticateUser(): Promise<void> {
  const resolveToken = (sessionToken: string) => {
    window.localStorage.setItem(STORAGE_KEY_SESSION_TOKEN, sessionToken)
  }

  // 1. Check if there is a mock token: only used for dev purposes

  if (isDevelopment && MOCK_TOKEN) return resolveToken(MOCK_TOKEN)

  // 2. See if we are coming from Self Care and have a new token
  const hasSelfCareIdentityToken = window.location.hash.includes('#id=')
  if (hasSelfCareIdentityToken) {
    const selfCareIdentityToken = window.location.hash.replace('#id=', '')
    // Remove token from hash
    history.replaceState({}, document.title, window.location.href.split('#')[0])
    try {
      const result = await AuthServices.swapTokens(selfCareIdentityToken)
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

  /**
   * If we reach this point we don't have a valid token yet.
   * That could be fine if we are in a public route.
   */
}
