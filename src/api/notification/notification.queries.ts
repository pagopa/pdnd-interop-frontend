import { queryOptions } from '@tanstack/react-query'
import { NotificationServices } from './notification.services'

function getUserNotificationConfigs() {
  return queryOptions({
    queryKey: ['getUserNotificationConfiguration'],
    queryFn: () => NotificationServices.getUserNotificationConfigs(),
  })
}

export const NotificationQueries = {
  getUserNotificationConfigs,
}
