import { NotFoundError } from '@/utils/errors.utils'
import type { QueryClientConfig } from '@tanstack/react-query'

// 1000, 2000, 4000, 8000, 16000, with a maximum of 30 seconds
const exponentialBackoffRetry = (attemptIndex: number) => {
  return Math.min(1000 * 2 ** attemptIndex, 30 * 1000)
}

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      suspense: true,
      retryDelay: exponentialBackoffRetry,
    },
    mutations: {
      useErrorBoundary: false,
      retry: (attemptIndex, error) => {
        /**
         * Retry only on 404 error mutation. This is needed
         * for eventual consistency reasons.
         */
        if (error instanceof NotFoundError) {
          return attemptIndex < 4
        }
        return false
      },
      retryDelay: exponentialBackoffRetry,
    },
  },
}
