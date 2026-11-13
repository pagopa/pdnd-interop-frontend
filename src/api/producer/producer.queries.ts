import { queryOptions } from '@tanstack/react-query'
import type {
  GetProducerDashboardConsumerParams,
  GetProducerDashboardConsumersParams,
  GetProducerDashboardSaturationParams,
} from '../api.generatedTypes'
import { ProducerServices } from './producer.services'

function getDashboard() {
  return queryOptions({
    queryKey: ['ProducerGetDashboard'],
    queryFn: () => ProducerServices.getDashboard(),
    refetchInterval: 60_000,
  })
}

function getDashboardConsumers(params: GetProducerDashboardConsumersParams) {
  return queryOptions({
    queryKey: ['ProducerGetDashboardConsumers', params],
    queryFn: () => ProducerServices.getDashboardConsumers(params),
  })
}

function getDashboardConsumer(params: GetProducerDashboardConsumerParams) {
  return queryOptions({
    queryKey: ['ProducerGetDashboardConsumer', params],
    queryFn: () => ProducerServices.getDashboardConsumer(params),
  })
}

function getDashboardSaturation(params: GetProducerDashboardSaturationParams) {
  return queryOptions({
    queryKey: ['ProducerGetDashboardSaturation', params],
    queryFn: () => ProducerServices.getDashboardSaturation(params),
  })
}

function getDashboardArchiving() {
  return queryOptions({
    queryKey: ['ProducerGetDashboardArchiving'],
    queryFn: () => ProducerServices.getDashboardArchiving(),
  })
}

export const ProducerQueries = {
  getDashboard,
  getDashboardConsumers,
  getDashboardConsumer,
  getDashboardSaturation,
  getDashboardArchiving,
}
