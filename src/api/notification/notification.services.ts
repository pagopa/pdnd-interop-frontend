import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { Notifications } from '../api.generatedTypes'
import { type MarkNotificationsAsReadPayload, type Notification } from '../api.generatedTypes'

export interface GetUserNotificationsParams {
  /** Query to filter EServices by name */
  q?: string
  /**
   * comma separated sequence of consumers IDs
   * @default []
   */
  category?: string
  /** if true only delegated e-services will be returned, if false only non-delegated e-services will be returned, if not present all e-services will be returned */
  state?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export const mockedNotifications: Notification[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    userId: '111852d9-1834-4654-b389-9efe9e0d1646',
    tenantId: 'd0b6f9f9-e1a5-4f3d-9c3f-9a4f6d3a8e1b',
    body: 'Hai un nuovo messaggio da Mario Rossi.',
    readAt: null,
    createdAt: '2025-09-23T12:30:00.000Z',
    deepLink: '',
  },
]

async function getUserNotificationsList(params: GetUserNotificationsParams) {
  const response = await axiosInstance.get<Notifications>(
    `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications`,
    { params }
  )

  const responseMock: Notifications = {
    pagination: { limit: 10, offset: 0, totalCount: 10 },
    results: mockedNotifications,
  }

  // return responseMock // TODO to be removed when API will be ready
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
    `${BACKEND_FOR_FRONTEND_URL}/notifications/${notificationId}/delete`
  )
}

async function deleteNotifications(payload: { ids: string[] }) {
  return await axiosInstance.delete<void>(`${BACKEND_FOR_FRONTEND_URL}/inAppNotifications/bulk`, {
    data: payload,
  })
}

export const NotificationServices = {
  getUserNotificationsList,
  markAsRead,
  markBulkAsRead,
  markAsNotRead,
  markBulkAsNotRead,
  deleteNotification,
  deleteNotifications,
}
