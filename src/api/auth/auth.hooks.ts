import { useSuspenseQuery } from '@tanstack/react-query'
import { AuthQueries } from './auth.queries'
import { parseJwt } from './auth.utils'

function useJwt() {
  const { data: sessionToken, isLoading: isLoadingSession } = useSuspenseQuery(
    AuthQueries.getSessionToken()
  )

  return { ...parseJwt(sessionToken), isLoadingSession }
}

export const AuthHooks = {
  useJwt,
}
