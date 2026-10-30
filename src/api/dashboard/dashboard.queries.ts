import { queryOptions } from '@tanstack/react-query'
import type { GetProducerDashboardSaturationParams } from '../api.generatedTypes'
import { DashboardServices } from './dashboard.services'

function getProducerDashboardSaturation(params: GetProducerDashboardSaturationParams) {
  return queryOptions({
    queryKey: ['GetProducerDashboardSaturation', params],
    queryFn: () => DashboardServices.getProducerDashboardSaturation(params),
  })
}

export const DashboardQueries = {
  getProducerDashboardSaturation,
}
