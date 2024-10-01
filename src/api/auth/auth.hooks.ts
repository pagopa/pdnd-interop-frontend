import { useSuspenseQuery } from '@tanstack/react-query'
import { AuthQueries } from './auth.queries'
import { parseJwt } from './auth.utils'

function useJwt() {
  const { data: sessionToken } = useSuspenseQuery(AuthQueries.getSessionToken())
  return parseJwt(sessionToken)
}

export const AuthHooks = {
  useJwt,
}
