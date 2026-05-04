import { queryOptions } from '@tanstack/react-query'
import { ThresholdsServices } from './thresholds.services'

function getThresholdsJson() {
  return queryOptions({
    queryKey: ['GetThresholdsJson'],
    queryFn: ThresholdsServices.getThresholdsJson,
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export const ThresholdsQueries = {
  getThresholdsJson,
}
