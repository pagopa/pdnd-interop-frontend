import { useContext, useMemo } from 'react'
import { TokenContext } from '../lib/context'
import { jwtToUser } from '../lib/jwt-utils'

export const useUser = () => {
  const { token } = useContext(TokenContext)

  const user = useMemo(() => {
    return token ? jwtToUser(token) : null
  }, [token])

  function isCurrentUser(userId: string) {
    return user && user.id === userId
  }

  return { user, isCurrentUser }
}
