import { queryOptions } from '@tanstack/react-query'
import { ThresholdsServices } from './thresholds.services'

function getThresholdsBannerJson() {
  return queryOptions({
    queryKey: ['GetThresholdsBannerJson'],
    queryFn: ThresholdsServices.getThresholdsBannerJson,
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export const ThresholdsQueries = {
  getThresholdsBannerJson,
}
