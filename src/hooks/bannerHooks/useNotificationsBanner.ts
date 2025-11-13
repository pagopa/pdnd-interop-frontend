import { useQuery } from '@tanstack/react-query'
import { useBaseBanner } from './useBaseBanner'
import { NotificationQueries } from '@/api/notification'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'lastNotificationsViewed'

export function useNotificationsBanner() {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'notificationsBanner',
  })
  const { data } = useQuery(NotificationQueries.getNotificationsBannerConfigJson())

  const { isOpen, closeBanner } = useBaseBanner({
    data,
    storageKey: STORAGE_KEY,
  })

  const text = t('body')
  const title = t('title')
  const action1Label = t('action1Label')
  const action2Label = t('action2Label')

  return { title, text, action1Label, action2Label, isOpen, closeBanner }
}
