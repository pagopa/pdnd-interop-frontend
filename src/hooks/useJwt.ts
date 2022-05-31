import { useContext, useMemo } from 'react'
import { TokenContext } from '../lib/context'
import { parseJwt } from '../lib/jwt-utils'

export const useJwt = () => {
  const { token } = useContext(TokenContext)

  const jwt = useMemo(() => {
    return token ? parseJwt(token) : undefined
  }, [token])

  function isCurrentUser(userId: string) {
    return jwt && jwt.uid === userId
  }

  const currentRoles = jwt ? jwt.organization.roles.map((r) => r.role) : []

  function isAdmin() {
    return currentRoles.length === 1 && currentRoles[0] === 'admin'
  }

  return { jwt, token, isCurrentUser, isAdmin, currentRoles }
}
