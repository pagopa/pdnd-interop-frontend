import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import { AuthHooks } from '@/api/auth'
import type { UserNotification } from '@/api/notification/notification.services'
import { NotificationMutations } from '@/api/notification/notification.mutation'

function useGetNotificationsActions(notification?: UserNotification): {
  actions: Array<ActionItemButton>
} {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { isAdmin } = AuthHooks.useJwt()
  const { mutate: deleteNotification } = NotificationMutations.useDeleteNotification()
  const { mutate: markAsReadNotification } = NotificationMutations.useMarkAsRead()
  const { mutate: markAsNotReadNotification } = NotificationMutations.useMarkAsNotRead()

  if (!notification || !isAdmin) return { actions: [] } //TODO Is the isAdmin check required?

  function handleDeleteNotification() {
    if (!notification) return
    deleteNotification({ id: notification.id })
  }

  function handleMarkAsRead() {
    if (!notification) return
    if (notification.readStatus === false) {
      markAsReadNotification({ id: notification.id })
    }
  }

  function handleMarkAsNotRead() {
    if (!notification) return
    if (notification.readStatus === true) {
      markAsNotReadNotification({ id: notification.id })
    }
  }

  const deleteNotifcationAction: ActionItemButton = {
    action: handleDeleteNotification,
    label: t('delete'),
  }

  const markAsReadNotifcationAction: ActionItemButton = {
    action: handleMarkAsRead,
    label: t('markAsRead'),
  }

  const markAsNotReadNotifcationAction: ActionItemButton = {
    action: handleMarkAsNotRead,
    label: t('marsAsNotRead'),
  }

  const validActions = notification.readStatus
    ? [deleteNotifcationAction, markAsReadNotifcationAction]
    : [deleteNotifcationAction, markAsNotReadNotifcationAction]

  return {
    actions: validActions,
  }
}

export default useGetNotificationsActions
