import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

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

export type Notification = {
  id: string
  userId: string
  tenantId: string
  body: string
  notificationType: string
  entityId: string
  readAt: string | null | undefined // .nullish() corrisponde a 'T | null | undefined'
  createdAt: string
}

export const mockedNotifications: Notification[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    userId: '111852d9-1834-4654-b389-9efe9e0d1646',
    tenantId: 'd0b6f9f9-e1a5-4f3d-9c3f-9a4f6d3a8e1b',
    body: 'Hai un nuovo messaggio da Mario Rossi.',
    notificationType: 'NEW_MESSAGE',
    entityId: 'c7c8e9f0-a1b2-c3d4-e5f6-a7b8c9d0e1f2',
    readAt: null,
    createdAt: '2025-09-23T12:30:00.000Z',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    userId: '111852d9-1834-4654-b389-9efe9e0d1646',
    tenantId: 'd0b6f9f9-e1a5-4f3d-9c3f-9a4f6d3a8e1b',
    body: "Ti è stato assegnato il task: 'Completare report Q3'.",
    notificationType: 'TASK_ASSIGNED',
    entityId: 'd8d9e0f1-b2c3-d4e5-f6a7-b8c9d0e1f2a3',
    readAt: '2025-09-23T11:00:00.000Z',
    createdAt: '2025-09-23T10:45:15.000Z',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    userId: '222963e0-2945-5765-c490-0f0f0f1e2757',
    tenantId: 'd0b6f9f9-e1a5-4f3d-9c3f-9a4f6d3a8e1b',
    body: 'Manutenzione programmata del sistema per le ore 23:00.',
    notificationType: 'SYSTEM_ALERT',
    entityId: 'e9e0f1g2-c3d4-e5f6-g7a8-c9d0e1f2a3b4',
    readAt: undefined,
    createdAt: '2025-09-23T09:00:00.000Z',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-4567-890abcdef123',
    userId: '111852d9-1834-4654-b389-9efe9e0d1646',
    tenantId: 'd0b6f9f9-e1a5-4f3d-9c3f-9a4f6d3a8e1b',
    body: "Il tuo file 'report_annuale.pdf' è stato caricato con successo.",
    notificationType: 'FILE_UPLOADED',
    entityId: 'f0f1g2h3-d4e5-f6g7-h8a9-d0e1f2a3b4c5',
    readAt: '2025-09-22T18:05:00.000Z',
    createdAt: '2025-09-22T18:04:30.000Z',
  },
  {
    id: 'e5f6a7b8-c9d0-1234-5678-90abcdef1234',
    userId: '222963e0-2945-5765-c490-0f0f0f1e2757',
    tenantId: 'd0b6f9f9-e1a5-4f3d-9c3f-9a4f6d3a8e1b',
    body: 'Luigi Verdi ti ha menzionato in un commento.',
    notificationType: 'MENTION',
    entityId: 'g1g2h3i4-e5f6-g7h8-i9a0-e1f2a3b4c5d6',
    readAt: null,
    createdAt: '2025-09-23T12:32:05.000Z',
  },
]

async function getUserNotificationsList(params: GetUserNotificationsParams) {
  // const response = await axiosInstance.get<unknown>(
  //   `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications`,
  //   { params }
  // )

  console.log('Refetch!')
  return mockedNotifications as Notification[] // TODO to be removed when API will be ready
}

async function markAsRead({ id, ...payload }: { id: string }) {
  //   const response = await axiosInstance.post<UserNotifications>(
  //     `${BACKEND_FOR_FRONTEND_URL}/notifications/:id/markAsRead`,
  //     { params }
  //   )
  //   return response.data
  return
}

async function markAsNotRead({ id, ...payload }: { id: string }) {
  //   const response = await axiosInstance.post<UserNotifications>(
  //     `${BACKEND_FOR_FRONTEND_URL}/notifications/:id/markAsNotRead`,
  //     { params }
  //   )
  //   return response.data
  return
}

async function deleteNotification({ id }: { id: string }) {
  //return await axiosInstance.delete<void>(`${BACKEND_FOR_FRONTEND_URL}/notifications/:id/delete`)
  return
}

export const NotificationServices = {
  getUserNotificationsList,
  markAsRead,
  markAsNotRead,
  deleteNotification,
}
