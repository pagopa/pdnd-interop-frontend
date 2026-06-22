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
  const { t } = useTranslation('notification', {
    keyPrefix: 'notifications.configurationPage.outcome',
  })
  return useMutation({
    mutationFn: NotificationServices.updateTenantNotificationConfigs,
    meta: {
      successToastLabel: t('success'),
      errorToastLabel: t('error'),
    },
  })
}

function useMarkAsRead() {
  const { t } = useTranslation('notification', {
    keyPrefix: 'notifications.page.outcome',
  })
  return useMutation({
    mutationFn: (payload: { notificationId: string }) => NotificationServices.markAsRead(payload),
    meta: {
      successToastLabel: t('markAsRead.success'),
      errorToastLabel: t('markAsRead.error'),
    },
  })
}

function useBulkMarkAsRead() {
  const { t } = useTranslation('notification', {
    keyPrefix: 'notifications.page.outcome',
  })
  return useMutation({
    mutationFn: (payload: MarkNotificationsAsReadPayload) =>
      NotificationServices.markBulkAsRead(payload),
    meta: {
      successToastLabel: t('markAsReadBulk.success'),
      errorToastLabel: t('markAsReadBulk.error'),
    },
  })
}

function useMarkAsNotRead() {
  const { t } = useTranslation('notification', {
    keyPrefix: 'notifications.page.outcome',
  })
  return useMutation({
    mutationFn: (payload: { notificationId: string }) =>
      NotificationServices.markAsNotRead(payload),
    meta: {
      successToastLabel: t('markAsUnread.success'),
      errorToastLabel: t('markAsUnread.error'),
    },
  })
}

function useBulkMarkAsNotRead() {
  const { t } = useTranslation('notification', {
    keyPrefix: 'notifications.page.outcome',
  })
  return useMutation({
    mutationFn: (payload: MarkNotificationsAsReadPayload) =>
      NotificationServices.markBulkAsNotRead(payload),
    meta: {
      successToastLabel: t('markAsUnreadBulk.success'),
      errorToastLabel: t('markAsUnreadBulk.error'),
    },
  })
}

function useDeleteNotification() {
  const { t } = useTranslation('notification', {
    keyPrefix: 'notifications.page.outcome',
  })
  return useMutation({
    mutationFn: (payload: { notificationId: string }) =>
      NotificationServices.deleteNotification(payload),
    meta: {
      successToastLabel: t('delete.success'),
      errorToastLabel: t('delete.error'),
    },
  })
}

function useDeleteNotifications() {
  const { t } = useTranslation('notification', {
    keyPrefix: 'notifications.page.outcome',
  })
  return useMutation({
    mutationFn: (payload: { ids: string[] }) => NotificationServices.deleteNotifications(payload),
    meta: {
      successToastLabel: t('delete.success'),
      errorToastLabel: t('delete.error'),
    },
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
