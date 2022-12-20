import { useQuery } from '@tanstack/react-query'
import { UseQueryWrapper } from '../comon.api.types'
import { useJwt } from '@/hooks/useJwt'
import { NotFoundError } from '@/utils/errors.utils'
import { useQueriesPolling } from '@/contexts/QueriesPollingContext'

/**
 * This wrapper adds to the useQuery's react-query hook the following behaviours:
 *
 * - Queries are disabled if the jwt token is not in session.
 *   All the queries are protected by authorization bearer so this makes sense for now.
 *
 * - Added `skipThrowOn404Error` that disables the error boundary if 404 error is returned from backend.
 *   This is needed because the `getKeyList` service of the ClientServices object returns 404 if the client has no keys associated.
 */
export const useQueryWrapper: UseQueryWrapper = (key, queryFn, options) => {
  const { jwt } = useJwt()
  const { isPollingActive } = useQueriesPolling()

  return useQuery(key, queryFn, {
    useErrorBoundary: (error) => {
      if (options?.skipThrowOn404Error && error instanceof NotFoundError) {
        return false
      }
      return true
    },
    enabled: !!jwt && (options?.enabled ?? true),
    refetchInterval: isPollingActive && 1000,
    ...options,
  })
}
