import { NotFoundError } from '@/utils/errors.utils'
import { QueryClientConfig } from '@tanstack/react-query'

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      suspense: true,
      // avoids retries on status 404
      retry(failureCount, error) {
        if (error instanceof NotFoundError) {
          return false
        }
        return failureCount < 2
      },
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
    mutations: { useErrorBoundary: false },
  },
}
