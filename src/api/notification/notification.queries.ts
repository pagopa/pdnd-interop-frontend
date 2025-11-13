import { queryOptions } from '@tanstack/react-query'
import type { GetUserNotificationsParams } from './notification.services'
import { NotificationServices } from './notification.services'

function getUserNotificationsList(params: GetUserNotificationsParams) {
  return queryOptions({
    queryKey: ['UserNotificationsGetList', params],
    queryFn: () => NotificationServices.getUserNotificationsList(params),
  })
}
function getNotificationsBannerConfigJson() {
  return queryOptions({
    queryKey: ['getNotificationsBannerConfigJson'],
    queryFn: NotificationServices.getNotificationsBannerConfigJson,
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export const NotificationQueries = {
  getUserNotificationsList,
  getNotificationsBannerConfigJson,
}

