import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL, FEATURE_FLAG_NOTIFICATION_CONFIG } from '@/config/env'
import type {
  GetNotificationsParams,
  Notifications,
  TenantNotificationConfig,
  TenantNotificationConfigUpdateSeed,
  UserNotificationConfig,
  UserNotificationConfigUpdateSeed,
} from '../api.generatedTypes'
import { type MarkNotificationsAsReadPayload } from '../api.generatedTypes'

// export interface GetUserNotificationsParams {
//   /** Query to filter EServices by name */
//   q?: string
//   /**
//    * comma separated sequence of consumers IDs
//    * @default []
//    */
//   category?: string
//   /** if true only delegated e-services will be returned, if false only non-delegated e-services will be returned, if not present all e-services will be returned */
//   state?: string
//   /**
//    * @format int32
//    * @min 0
//    */
//   offset: number
//   /**
//    * @format int32
//    * @min 1
//    * @max 50
//    */
//   limit: number
// }

async function getUserNotificationsList(params: GetNotificationsParams) {
  const response = await axiosInstance.get<Notifications>(
    `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications`,
    { params }
  )

  return response.data
}

async function markAsRead({ notificationId }: { notificationId: string }) {
  const response = await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications/${notificationId}/markAsRead`
  )
  return response.data
}
async function markBulkAsRead(payload: MarkNotificationsAsReadPayload) {
  const response = await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications/bulk/markAsRead`,
    payload
  )
  return response.data
}

async function markAsNotRead({ notificationId }: { notificationId: string }) {
  const response = await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications/${notificationId}/markAsUnread`
  )
  return response.data
}

async function markBulkAsNotRead(payload: MarkNotificationsAsReadPayload) {
  const response = await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications/markAsUnread`,
    payload
  )
  return response.data
}

async function deleteNotification({ notificationId }: { notificationId: string }) {
  return await axiosInstance.delete<void>(
    `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications/${notificationId}`
  )
}

async function deleteNotifications(payload: { ids: string[] }) {
  return await axiosInstance.delete<void>(`${BACKEND_FOR_FRONTEND_URL}/inAppNotifications`, {
    data: payload,
  })
}

async function markNotificationsAsReadByEntityId({ entityId }: { entityId: string }) {
  if (FEATURE_FLAG_NOTIFICATION_CONFIG) {
    const response = await axiosInstance.post<void>(
      `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications/markAsReadByEntityId/${entityId}`
    )
    return response.data
  } else {
    return Promise.resolve()
  }
}

// export const NotificationServices = {
//   getUserNotificationsList,
//   markAsRead,
//   markBulkAsRead,
//   markAsNotRead,
//   markBulkAsNotRead,
//   deleteNotification,
//   deleteNotifications,
//   markNotificationsAsReadByEntityId,
// import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
// import type {
//   TenantNotificationConfig,
//   TenantNotificationConfigUpdateSeed,
//   UserNotificationConfig,
//   UserNotificationConfigUpdateSeed,
// } from '../api.generatedTypes'

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
  getUserNotificationsList,
  markAsRead,
  markBulkAsRead,
  markAsNotRead,
  markBulkAsNotRead,
  deleteNotification,
  deleteNotifications,
  markNotificationsAsReadByEntityId,
}
