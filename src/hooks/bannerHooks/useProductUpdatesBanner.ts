import { useQuery } from '@tanstack/react-query'
import { useBaseBanner } from './useBaseBanner'
import { NotificationQueries } from '@/api/notification'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'productUpdatesBannerDismissedUntil'

export function useProductUpdatesBanner() {
  const { t } = useTranslation('shared-components', { keyPrefix: 'productUpdatesBanner' })
  const { data } = useQuery(NotificationQueries.getNotificationsBannerConfigJson())

  const { isOpen, closeBanner } = useBaseBanner({
    data,
    storageKey: STORAGE_KEY,
    bannerKey: 'productUpdates',
    priority: 2, // lower than maintenance banner
  })

  const text = t('body')
  const title = t('title')
  const action1Label = t('action1Label')
  const action2Label = t('action2Label')
  const action1AriaLabel = t('action1AriaLabel')
  const action2AriaLabel = t('action2AriaLabel')

  return {
    title,
    text,
    action1Label,
    action2Label,
    action1AriaLabel,
    action2AriaLabel,
    isOpen,
    closeBanner,
  }
}
