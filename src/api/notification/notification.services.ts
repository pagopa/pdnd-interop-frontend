import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  TenantNotificationConfig,
  TenantNotificationConfigUpdateSeed,
  UserNotificationConfig,
  UserNotificationConfigUpdateSeed,
} from '../api.generatedTypes'

async function updateUserNotificationConfigs(payload: UserNotificationConfigUpdateSeed) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/userNotificationConfigs`,
    payload
  )
}

async function updateTenantNotificationConfigs(payload: TenantNotificationConfigUpdateSeed) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/tenantNotificationConfigs`,
    payload
  )
}

async function getUserNotificationConfigs() {
  const response = await axiosInstance.get<UserNotificationConfig>(
    `${BACKEND_FOR_FRONTEND_URL}/userNotificationConfigs`
  )

  return response.data
}
async function getTenantNotificationConfigs() {
  const response = await axiosInstance.get<TenantNotificationConfig>(
    `${BACKEND_FOR_FRONTEND_URL}/tenantNotificationConfigs`
  )
  return response.data
}
export const NotificationServices = {
  updateUserNotificationConfigs,
  updateTenantNotificationConfigs,
  getUserNotificationConfigs,
  getTenantNotificationConfigs,
}
