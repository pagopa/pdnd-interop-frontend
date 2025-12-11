import { queryOptions } from '@tanstack/react-query'
import { NotificationServices } from './notification.services'
import type { GetNotificationsParams } from '../api.generatedTypes'

function getUserNotificationsList(params: GetNotificationsParams) {
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

function getInAppNotificationsCount() {
  return queryOptions({
    queryKey: ['InAppNotificationsCount'],
    queryFn: () => NotificationServices.getInAppNotificationsCount(),
  })
}
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
  getUserNotificationsList,
  getInAppNotificationsCount,
  getNotificationsBannerConfigJson,
}
