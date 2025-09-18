import { useMutation } from '@tanstack/react-query'
import { NotificationServices } from './index'
function useUpdateNotificationUserConfigs() {
  return useMutation({
    mutationFn: NotificationServices.updateUserNotificationConfigs,
  })
}

export const NotificationMutations = {
  useUpdateNotificationUserConfigs,
}
