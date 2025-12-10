import { PRODUCER_ALLOWED_ORIGINS } from '@/config/env'
import type { JwtUser } from '@/types/party.types'
import memoize from 'lodash/memoize'
import { jwtDecode } from 'jwt-decode'

export type ParsedJwt = ReturnType<typeof parseJwt>

/**
 * Parse the JWT token and return the user informations stored in it
 */
export const parseJwt = memoize((token: string | null | undefined) => {
  const jwt = token ? jwtDecode<JwtUser>(token) : undefined
  const currentRoles = jwt ? jwt.organization.roles.map((r) => r.role) : []
  // According to the domain, if a user has the admin role, they don't have other roles,
  // which is why we check currentRoles.length === 1
  const isAdmin = currentRoles.length === 1 && currentRoles[0] === 'admin'
  const isOperatorAPI = currentRoles.includes('api')
  const isOperatorSecurity = currentRoles.includes('security')
  const isSupport = currentRoles.includes('support')
  const isOrganizationAllowedToProduce = !!(
    jwt?.externalId && PRODUCER_ALLOWED_ORIGINS.includes(jwt.externalId.origin)
  )
  const userEmail = jwt?.email

  return {
    jwt,
    currentRoles,
    isAdmin,
    isOperatorAPI,
    isOperatorSecurity,
    isSupport,
    isOrganizationAllowedToProduce,
    userEmail,
  }
})
