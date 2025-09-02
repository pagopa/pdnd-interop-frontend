import { queryOptions } from '@tanstack/react-query'
import { NotificationServices } from './notification.services'

function getUserNotificationConfiguration() {
  return queryOptions({
    queryKey: ['getUserNotificationConfiguration'],
    queryFn: () => NotificationServices.getUserNotificationConfiguration(),
  })
}

export const NotificationQueries = {
  getUserNotificationConfiguration,
}
