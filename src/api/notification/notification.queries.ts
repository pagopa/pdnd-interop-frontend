import { queryOptions } from '@tanstack/react-query'
import { NotificationServices } from './notification.services'

function getUserNotificationConfigs() {
  return queryOptions({
    queryKey: ['getUserNotificationConfiguration'],
    queryFn: () => NotificationServices.getUserNotificationConfigs(),
  })
}

function getTenantNotificationConfigs() {
  return queryOptions({
    queryKey: ['getTenantNotificationConfiguration'],
    queryFn: () => NotificationServices.getTenantNotificationConfigs(),
  })
}

export const NotificationQueries = {
  getUserNotificationConfigs,
  getTenantNotificationConfigs,
}
