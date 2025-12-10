import { useMutation } from '@tanstack/react-query'
import { NotificationServices } from './index'
import { useTranslation } from 'react-i18next'
import type { MarkNotificationsAsReadPayload } from '../api.generatedTypes'
function useUpdateNotificationUserConfigs() {
  const { t } = useTranslation('notification', {
    keyPrefix: 'notifications.configurationPage.outcome',
  })
  return useMutation({
    mutationFn: NotificationServices.updateUserNotificationConfigs,
    meta: {
      successToastLabel: t('success'),
      errorToastLabel: t('error'),
    },
  })
}

function useUpdateNotificationTenantConfigs() {
  return useMutation({
    mutationFn: NotificationServices.updateTenantNotificationConfigs,
  })
}

function useMarkAsRead() {
  return useMutation({
    mutationFn: (payload: { notificationId: string }) => NotificationServices.markAsRead(payload),
  })
}

function useBulkMarkAsRead() {
  return useMutation({
    mutationFn: (payload: MarkNotificationsAsReadPayload) =>
      NotificationServices.markBulkAsRead(payload),
  })
}

function useMarkAsNotRead() {
  return useMutation({
    mutationFn: (payload: { notificationId: string }) =>
      NotificationServices.markAsNotRead(payload),
  })
}

function useBulkMarkAsNotRead() {
  return useMutation({
    mutationFn: (payload: MarkNotificationsAsReadPayload) =>
      NotificationServices.markBulkAsNotRead(payload),
  })
}

function useDeleteNotification() {
  return useMutation({
    mutationFn: (payload: { notificationId: string }) =>
      NotificationServices.deleteNotification(payload),
  })
}

function useDeleteNotifications() {
  return useMutation({
    mutationFn: (payload: { ids: string[] }) => NotificationServices.deleteNotifications(payload),
  })
}

function useMarkNotificationsAsReadByEntityId() {
  return useMutation({
    mutationFn: (payload: { entityId: string }) =>
      NotificationServices.markNotificationsAsReadByEntityId(payload),
    retry: false,
  })
}

export const NotificationMutations = {
  useUpdateNotificationUserConfigs,
  useUpdateNotificationTenantConfigs,
  useMarkAsRead,
  useBulkMarkAsRead,
  useMarkAsNotRead,
  useBulkMarkAsNotRead,
  useDeleteNotification,
  useDeleteNotifications,
  useMarkNotificationsAsReadByEntityId,
}
