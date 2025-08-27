import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
// import type { NotificationConfigSeed } from '../api.generatedTypes'

async function updateUserNotificationConfiguration(payload: unknown) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/notification-config/userNotificationConfigs`,
    payload
  )
}

export const notificationServices = { updateUserNotificationConfiguration }
