import { useMutation } from '@tanstack/react-query'
import { notificationServices } from './index'
function useUpdateNotificationUserConfigs() {
  return useMutation({
    mutationFn: notificationServices.updateUserNotificationConfiguration,
  })
}

export const NotificationMutations = {
  useUpdateNotificationUserConfigs,
}
