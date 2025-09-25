import { useMutation } from '@tanstack/react-query'
import { NotificationServices } from './notification.services'

function useMarkAsRead() {
  return useMutation({
    mutationFn: (payload: { id: string }) => NotificationServices.markAsRead(payload),
  })
}

function useMarkAsNotRead() {
  return useMutation({
    mutationFn: (payload: { id: string }) => NotificationServices.markAsNotRead(payload),
  })
}

function useDeleteNotification() {
  return useMutation({
    mutationFn: (payload: { id: string }) => NotificationServices.deleteNotification(payload),
  })
}

export const NotificationMutations = {
  useMarkAsRead,
  useMarkAsNotRead,
  useDeleteNotification,
}
