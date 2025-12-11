import React from 'react'
import { NotificationMutations } from '@/api/notification'

export const useMarkNotificationsAsRead = (entityId: string | undefined) => {
  const { mutate: markNotificationsAsRead } =
    NotificationMutations.useMarkNotificationsAsReadByEntityId()

  React.useEffect(() => {
    if (entityId) {
      markNotificationsAsRead({ entityId })
    }
  }, [entityId, markNotificationsAsRead])
}
