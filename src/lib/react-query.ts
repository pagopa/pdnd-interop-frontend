import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return false
        }
        return true
      },
      // avoids retries on status 404
      retry(failureCount, error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return false
        }
        return failureCount < 2
      },
      staleTime: 1000 * 60 * 10,
    },
    mutations: { useErrorBoundary: false },
  },
})
