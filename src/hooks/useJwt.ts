import { AuthHooks } from '@/api/auth'
import type { JwtUser } from '@/types/party.types'
import memoize from 'lodash/memoize'

/**
 * Parse the JWT token and return the user informations stored in it
 */
const parseJwt = memoize((token: string | undefined) => {
  const jwt = token ? (JSON.parse(window.atob(token.split('.')[1])) as JwtUser) : undefined
  const currentRoles = jwt ? jwt.organization.roles.map((r) => r.role) : []
  const isAdmin = currentRoles.length === 1 && currentRoles[0] === 'admin'
  const isOperatorAPI = currentRoles.includes('api')
  const isOperatorSecurity = currentRoles.includes('security')
  const isSupport = currentRoles.includes('support')

  function hasSessionExpired() {
    return jwt ? new Date() > new Date(jwt.exp * 1000) : false
  }

  return {
    jwt,
    currentRoles,
    isAdmin,
    isOperatorAPI,
    isOperatorSecurity,
    isSupport,
    hasSessionExpired,
  }
})

export const useJwt = () => {
  const { data: sessionToken } = AuthHooks.useGetSessionToken()
  return parseJwt(sessionToken)
}
