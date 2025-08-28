import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  UserNotificationConfig,
  UserNotificationConfigUpdateSeed,
} from '../api.generatedTypes'

async function updateUserNotificationConfiguration(payload: UserNotificationConfigUpdateSeed) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/notification-config/userNotificationConfigs`,
    payload
  )
}

async function getUserNotificationConfiguration() {
  const response = await axiosInstance.get<UserNotificationConfig>(
    `${BACKEND_FOR_FRONTEND_URL}/notification-config/userNotificationConfigs`
  )
  return response.data
}

export const NotificationServices = {
  updateUserNotificationConfiguration,
  getUserNotificationConfiguration,
}
