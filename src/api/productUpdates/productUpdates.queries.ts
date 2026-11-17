import { queryOptions } from '@tanstack/react-query'
import { ProductUpdatesServices } from './productUpdates.services'

function getProductUpdatesJson(language: string) {
  return queryOptions({
    queryKey: ['GetProductUpdatesJson', language],
    queryFn: () => ProductUpdatesServices.getProductUpdatesJson(language),
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export const ProductUpdatesQueries = {
  getProductUpdatesJson,
}
