import { useAuth } from '@/stores'
import { AuthenticationError } from '@/utils/errors.utils'

export function useAuthenticatedUser() {
  const { isAuthenticated, user } = useAuth()
  if (!user || !isAuthenticated) {
    throw new AuthenticationError()
  }
  return user
}
