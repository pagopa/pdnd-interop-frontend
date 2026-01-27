import axiosInstance from '@/config/axios'
import axios from 'axios'
import {
  APP_MODE,
  BACKEND_FOR_FRONTEND_URL,
  FEATURE_FLAG_NOTIFICATION_CONFIG,
  INTEROP_RESOURCES_BASE_URL,
} from '@/config/env'
import type {
  GetNotificationsParams,
  Notifications,
  TenantNotificationConfig,
  TenantNotificationConfigUpdateSeed,
  UserNotificationConfig,
  UserNotificationConfigUpdateSeed,
  NotificationsCountBySection,
  MarkNotificationsAsReadPayload,
} from '../api.generatedTypes'
import type { BannerData } from '@/hooks/bannerHooks/utils'

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
    `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications/bulk/markAsUnread`,
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

async function getNotificationsBannerConfigJson() {
  // Mock data in development to avoid CORS issues with S3
  if (APP_MODE === 'development') {
    return {
      start: {
        date: '2023-05-25',
        time: '10:47',
      },
      end: {
        date: '2028-05-25',
        time: '12:47',
      },
    } as BannerData
  }

  const response = await axios.get<BannerData>(
    `${INTEROP_RESOURCES_BASE_URL}/notifications-window/data.json`
  )
  return response.data
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

async function getInAppNotificationsCount() {
  if (FEATURE_FLAG_NOTIFICATION_CONFIG) {
    const response = await axiosInstance.get<NotificationsCountBySection>(
      `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications/count`
    )
    return response.data
  } else {
    return Promise.resolve({
      erogazione: {
        richieste: 0,
        finalita: 0,
        'template-eservice': 0,
        'e-service': 0,
        portachiavi: 0,
        totalCount: 0,
      },
      fruizione: {
        richieste: 0,
        finalita: 0,
        totalCount: 0,
      },
      'catalogo-e-service': {
        totalCount: 0,
      },
      aderente: {
        deleghe: 0,
        anagrafica: 0,
        totalCount: 0,
      },
      'gestione-client': {
        'api-e-service': 0,
        totalCount: 0,
      },
      notifiche: {
        totalCount: 0,
      },
    })
  }
}

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
  getNotificationsBannerConfigJson,
  markNotificationsAsReadByEntityId,
  getInAppNotificationsCount,
}
