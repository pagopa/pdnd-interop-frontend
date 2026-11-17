import { queryOptions } from '@tanstack/react-query'
import type {
  GetProducerDashboardConsumerParams,
  GetProducerDashboardConsumersParams,
  GetProducerDashboardSaturationParams,
  GetProducerEServiceMonitoringParams,
  GetProducerEServiceMonitoringArchivingParams,
  GetProducerEServiceMonitoringSaturationParams,
  GetProducerEServiceMonitoringConsumerPurposesParams,
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

function getEServiceMonitoring(params: GetProducerEServiceMonitoringParams) {
  return queryOptions({
    queryKey: ['ProducerGetEServiceMonitoring', params],
    queryFn: () => ProducerServices.getEServiceMonitoring(params),
  })
}

function getEServiceMonitoringArchiving(params: GetProducerEServiceMonitoringArchivingParams) {
  return queryOptions({
    queryKey: ['ProducerGetEServiceMonitoringArchiving', params],
    queryFn: () => ProducerServices.getEServiceMonitoringArchiving(params),
  })
}

function getEServiceMonitoringSaturation(params: GetProducerEServiceMonitoringSaturationParams) {
  return queryOptions({
    queryKey: ['ProducerGetEServiceMonitoringSaturation', params],
    queryFn: () => ProducerServices.getEServiceMonitoringSaturation(params),
  })
}

function getEServiceMonitoringConsumerPurposes(
  params: GetProducerEServiceMonitoringConsumerPurposesParams
) {
  return queryOptions({
    queryKey: ['ProducerGetEServiceMonitoringConsumerPurposes', params],
    queryFn: () => ProducerServices.getEServiceMonitoringConsumerPurposes(params),
  })
}

export const ProducerQueries = {
  getDashboard,
  getDashboardConsumers,
  getDashboardConsumer,
  getDashboardSaturation,
  getDashboardArchiving,
  getEServiceMonitoring,
  getEServiceMonitoringArchiving,
  getEServiceMonitoringSaturation,
  getEServiceMonitoringConsumerPurposes,
}
