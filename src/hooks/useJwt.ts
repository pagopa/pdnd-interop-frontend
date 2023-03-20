import React from 'react'
import { useAuth } from '@/stores'
import type { JwtUser } from '@/types/party.types'
import memoize from 'lodash/memoize'

const parseJwt = memoize((token: string | null) => {
  const jwt = token ? (JSON.parse(window.atob(token.split('.')[1])) as JwtUser) : undefined
  const currentRoles = jwt ? jwt.organization.roles.map((r) => r.role) : []
  const isAdmin = currentRoles.length === 1 && currentRoles[0] === 'admin'
  const isOperatorAPI = currentRoles.includes('api')
  const isOperatorSecurity = currentRoles.includes('security')

  return { jwt, currentRoles, isAdmin, isOperatorAPI, isOperatorSecurity }
})

export const useJwt = () => {
  const { sessionToken } = useAuth()

  const { jwt, currentRoles, isAdmin, isOperatorAPI, isOperatorSecurity } = parseJwt(sessionToken)

  const hasSessionExpired = React.useCallback(
    () => (jwt ? new Date() > new Date(jwt.exp * 1000) : false),
    [jwt]
  )

  return {
    jwt,
    hasSessionExpired,
    isAdmin,
    isOperatorAPI,
    isOperatorSecurity,
    currentRoles,
  }
}
