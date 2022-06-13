import { useContext, useMemo } from 'react'
import { JwtUser } from '../../types'
import { TokenContext } from '../lib/context'

const parseJwt = (token: string): JwtUser => {
  return JSON.parse(atob(token.split('.')[1]))
  /*
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
  */
}

export const useJwt = () => {
  const { token } = useContext(TokenContext)

  const jwt = useMemo(() => {
    return token ? parseJwt(token) : undefined
  }, [token])

  const currentRoles = jwt ? jwt.organization.roles.map((r) => r.role) : []
  const isAdmin = currentRoles.length === 1 && currentRoles[0] === 'admin'
  const isOperatorAPI = Boolean(currentRoles.includes('api'))
  const isOperatorSecurity = Boolean(currentRoles.includes('security'))

  function isCurrentUser(userId: string) {
    return jwt && jwt.uid === userId
  }

  return { jwt, isCurrentUser, isAdmin, isOperatorAPI, isOperatorSecurity, currentRoles }
}
