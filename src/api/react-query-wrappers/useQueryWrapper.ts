import { useQuery } from '@tanstack/react-query'
import type { UseQueryWrapper } from './react-query-wrappers.types'
import { NotFoundError } from '@/utils/errors.utils'

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
  return useQuery(key, queryFn, {
    useErrorBoundary: (error) => {
      if (options?.skipThrowOn404Error && error instanceof NotFoundError) {
        return false
      }
      return true
    },
    // Disable the query if the jwt is not in session
    ...options,
  })
}
