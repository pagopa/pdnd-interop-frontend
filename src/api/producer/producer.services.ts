import axiosInstance from '@/config/axios'
import { APP_MODE, BACKEND_FOR_FRONTEND_URL, MOCK_PRODUCER_DASHBOARD } from '@/config/env'
import type {
  GetProducerDashboardConsumerParams,
  GetProducerDashboardConsumersParams,
  GetProducerDashboardSaturationParams,
  GetProducerEServiceMonitoringParams,
  GetProducerEServiceMonitoringArchivingParams,
  GetProducerEServiceMonitoringSaturationParams,
  MonitoringArchiving,
  ProducerDashboard,
  ProducerDashboardConsumer,
  ProducerDashboardConsumers,
  ProducerDashboardSaturation,
  ProducerEServiceMonitoring,
  ProducerEServiceMonitoringSaturation,
} from '../api.generatedTypes'

async function getDashboard(): Promise<ProducerDashboard> {
  // Dev-only offline mock. `import.meta.env.DEV` is statically false in production builds,
  // so this branch and the fixture chunk are tree-shaken. No catch-fallback, no latency.
  if (import.meta.env.DEV && APP_MODE === 'development' && MOCK_PRODUCER_DASHBOARD) {
    const { mockProducerDashboard } = await import('../../../__mocks__/data/producer.mocks')
    return structuredClone(mockProducerDashboard)
  }

  const response = await axiosInstance.get<ProducerDashboard>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard`
  )

  return response.data
}

async function getDashboardConsumers(
  params: GetProducerDashboardConsumersParams
): Promise<ProducerDashboardConsumers> {
  if (import.meta.env.DEV && APP_MODE === 'development' && MOCK_PRODUCER_DASHBOARD) {
    const { getMockProducerDashboardConsumers } =
      await import('../../../__mocks__/data/producer.mocks')
    return getMockProducerDashboardConsumers(params)
  }

  const response = await axiosInstance.get<ProducerDashboardConsumers>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/consumers`,
    { params }
  )

  return response.data
}

async function getDashboardConsumer({
  consumerId,
  ...params
}: GetProducerDashboardConsumerParams): Promise<ProducerDashboardConsumer> {
  if (import.meta.env.DEV && APP_MODE === 'development' && MOCK_PRODUCER_DASHBOARD) {
    const { getMockProducerDashboardConsumer } =
      await import('../../../__mocks__/data/producer.mocks')
    return getMockProducerDashboardConsumer({ consumerId, ...params })
  }

  const response = await axiosInstance.get<ProducerDashboardConsumer>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/consumers/${consumerId}`,
    { params }
  )

  return response.data
}

async function getDashboardSaturation(
  params: GetProducerDashboardSaturationParams
): Promise<ProducerDashboardSaturation> {
  if (import.meta.env.DEV && APP_MODE === 'development' && MOCK_PRODUCER_DASHBOARD) {
    const { getMockProducerDashboardSaturation } =
      await import('../../../__mocks__/data/producer.mocks')
    return getMockProducerDashboardSaturation(params)
  }

  const response = await axiosInstance.get<ProducerDashboardSaturation>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/saturation`,
    { params }
  )

  return response.data
}

async function getDashboardArchiving(): Promise<MonitoringArchiving> {
  if (import.meta.env.DEV && APP_MODE === 'development' && MOCK_PRODUCER_DASHBOARD) {
    const { mockProducerDashboardArchiving } =
      await import('../../../__mocks__/data/producer.mocks')
    return structuredClone(mockProducerDashboardArchiving)
  }

  const response = await axiosInstance.get<MonitoringArchiving>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/archiving`
  )

  return response.data
}

async function getEServiceMonitoring({
  eserviceId,
  descriptorId,
}: GetProducerEServiceMonitoringParams): Promise<ProducerEServiceMonitoring> {
  if (import.meta.env.DEV && APP_MODE === 'development' && MOCK_PRODUCER_DASHBOARD) {
    const { getMockProducerEServiceMonitoring, getMockMonitoringDescriptor } =
      await import('../../../__mocks__/data/producer-monitoring.mocks')
    const params = { eserviceId, descriptorId }
    return getMockProducerEServiceMonitoring(params, await getMockMonitoringDescriptor(params))
  }

  const response = await axiosInstance.get<ProducerEServiceMonitoring>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${eserviceId}/descriptors/${descriptorId}/monitoring`
  )
  return response.data
}

async function getEServiceMonitoringArchiving({
  eserviceId,
}: GetProducerEServiceMonitoringArchivingParams): Promise<MonitoringArchiving> {
  if (import.meta.env.DEV && APP_MODE === 'development' && MOCK_PRODUCER_DASHBOARD) {
    const { loadMockProducerEServiceMonitoringArchiving } =
      await import('../../../__mocks__/data/producer-monitoring.mocks')
    return loadMockProducerEServiceMonitoringArchiving({ eserviceId })
  }

  const response = await axiosInstance.get<MonitoringArchiving>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${eserviceId}/monitoring/archiving`
  )
  return response.data
}

async function getEServiceMonitoringSaturation({
  eserviceId,
  descriptorId,
  ...params
}: GetProducerEServiceMonitoringSaturationParams): Promise<ProducerEServiceMonitoringSaturation> {
  if (import.meta.env.DEV && APP_MODE === 'development' && MOCK_PRODUCER_DASHBOARD) {
    const { getMockProducerEServiceMonitoringSaturation, getMockMonitoringDescriptor } =
      await import('../../../__mocks__/data/producer-monitoring.mocks')
    return getMockProducerEServiceMonitoringSaturation(
      { eserviceId, descriptorId, ...params },
      await getMockMonitoringDescriptor({ eserviceId, descriptorId })
    )
  }

  const response = await axiosInstance.get<ProducerEServiceMonitoringSaturation>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/eservices/${eserviceId}/descriptors/${descriptorId}/monitoring/saturation`,
    { params }
  )
  return response.data
}

export const ProducerServices = {
  getDashboard,
  getDashboardConsumers,
  getDashboardConsumer,
  getDashboardSaturation,
  getDashboardArchiving,
  getEServiceMonitoring,
  getEServiceMonitoringArchiving,
  getEServiceMonitoringSaturation,
}
