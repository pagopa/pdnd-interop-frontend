import { queryOptions } from '@tanstack/react-query'
import type { GetUserNotificationsParams } from './notification.services'
import { NotificationServices } from './notification.services'

function getUserNotificationsList(params: GetUserNotificationsParams) {
  return queryOptions({
    queryKey: ['UserNotificationsGetList', params],
    queryFn: () => NotificationServices.getUserNotificationsList(params),
  })
}

function getInAppNotificationsCount() {
  return queryOptions({
    queryKey: ['InAppNotificationsCount'],
    queryFn: () => NotificationServices.getInAppNotificationsCount(),
  })
}

export const NotificationQueries = {
  getUserNotificationsList,
  getInAppNotificationsCount,
}
