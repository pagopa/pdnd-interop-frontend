import { queryOptions } from '@tanstack/react-query'
import { ProductUpdatesServices } from './productUpdates.services'

function getProductUpdatesJson() {
  return queryOptions({
    queryKey: ['GetProductUpdatesJson'],
    queryFn: ProductUpdatesServices.getProductUpdatesJson,
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export const ProductUpdatesQueries = {
  getProductUpdatesJson,
}
