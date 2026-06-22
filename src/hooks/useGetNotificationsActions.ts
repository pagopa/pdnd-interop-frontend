import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import { NotificationMutations } from '@/api/notification/notification.mutations'
import { theme } from '@pagopa/interop-fe-commons'
import { type Notification } from '@/api/api.generatedTypes'

function useGetNotificationsActions(notification?: Notification): {
  actions: Array<ActionItemButton>
} {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { mutate: deleteNotification } = NotificationMutations.useDeleteNotification()
  const { mutate: markAsReadNotification } = NotificationMutations.useMarkAsRead()
  const { mutate: markAsNotReadNotification } = NotificationMutations.useMarkAsNotRead()

  if (!notification) return { actions: [] }

  function handleDeleteNotification() {
    if (notification) deleteNotification({ notificationId: notification.id })
  }

  function handleMarkAsRead() {
    if (notification && !notification.readAt) {
      markAsReadNotification({ notificationId: notification.id })
    }
  }

  function handleMarkAsNotRead() {
    if (notification && notification.readAt) {
      markAsNotReadNotification({ notificationId: notification.id })
    }
  }

  const deleteNotificationAction: ActionItemButton = {
    action: handleDeleteNotification,
    label: t('delete'),
    color: 'error',
    fontColor: theme.palette.error.main,
  }

  const markAsReadNotificationAction: ActionItemButton = {
    action: handleMarkAsRead,
    label: t('markAsRead'),
  }

  const markAsNotReadNotificationAction: ActionItemButton = {
    action: handleMarkAsNotRead,
    label: t('marsAsNotRead'),
  }

  const validActions = !notification.readAt
    ? [markAsReadNotificationAction, deleteNotificationAction]
    : [markAsNotReadNotificationAction, deleteNotificationAction]

  return {
    actions: validActions,
  }
}

export default useGetNotificationsActions
