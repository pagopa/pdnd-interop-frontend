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

export type UserNotification = {
  /** @format uuid */
  id: string
  data: string
  name: string
  category: 'DELIVER' | 'RECEIVE'
  object: string
  readStatus: boolean
}

export const mockedNotifications: UserNotification[] = [
  {
    id: 'a3f29d60-9e3c-4ef1-8f91-1d9cba77c912',
    data: '14/02/2025 13:58',
    name: 'Package delivered to front door',
    category: 'DELIVER',
    object: 'oggetto1',
    readStatus: false,
  },
  {
    id: 'b8c1a3b2-7e3e-4fa2-8d4d-5a42ec3873f5',
    data: '13/02/2025 11:23',
    name: 'New shipment received at warehouse',
    category: 'RECEIVE',
    object: 'oggetto2',
    readStatus: true,
  },
  {
    id: 'c17d6a1f-b3c2-4f7e-b2f2-2aebbb9178e4',
    data: '07/05/2025 17:02',
    name: 'Delivery attempt failed',
    category: 'DELIVER',
    object: 'oggetto3',
    readStatus: false,
  },
  {
    id: 'd66f92e8-21de-48f1-9a6a-8cc7e29a4d1c',
    data: '22/03/2025 13:45',
    name: 'Incoming inventory scanned',
    category: 'RECEIVE',
    object: 'oggetto4',
    readStatus: true,
  },
  {
    id: 'e4b9e49e-324f-4e8d-bc68-429b8f12b7fa',
    data: '21/06/2025 08:34',
    name: 'Courier en route to destination',
    category: 'DELIVER',
    object:
      'oggetto5 jofigeurgnegneinfefunefinwsfuiwenfewihrnfwkfnweifwnfiwnrdwdnwidnwfiwsndfwifwdnwediwndiwfndwifwfueids',
    readStatus: false,
  },
]

async function getUserNotificationsList(params: GetUserNotificationsParams) {
  // const response = await axiosInstance.get<unknown>(
  //   `${BACKEND_FOR_FRONTEND_URL}/inAppNotifications`,
  //   { params }
  // )
  return mockedNotifications as UserNotification[] // TODO to be removed when API will be ready
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
