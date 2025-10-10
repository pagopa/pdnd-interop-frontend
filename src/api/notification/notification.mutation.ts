import { useMutation } from '@tanstack/react-query'
import { NotificationServices } from './notification.services'
import type { MarkNotificationsAsReadPayload } from '../api.generatedTypes'

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

export const NotificationMutations = {
  useMarkAsRead,
  useBulkMarkAsRead,
  useMarkAsNotRead,
  useBulkMarkAsNotRead,
  useDeleteNotification,
  useDeleteNotifications,
}
