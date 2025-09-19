import { useMutation } from '@tanstack/react-query'
import { NotificationServices } from './index'
import { useTranslation } from 'react-i18next'
function useUpdateNotificationUserConfigs() {
  const { t } = useTranslation('notification', {
    keyPrefix: 'configurationPage.outcome',
  })
  return useMutation({
    mutationFn: NotificationServices.updateUserNotificationConfigs,
    meta: {
      successToastLabel: t('success'),
      errorToastLabel: t('error'),
    },
  })
}

export const NotificationMutations = {
  useUpdateNotificationUserConfigs,
}
