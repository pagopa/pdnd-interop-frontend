import { useQuery } from '@tanstack/react-query'
import { useBaseBanner } from './useBaseBanner'
import { useTranslation } from 'react-i18next'
import { ThresholdsQueries } from '@/api/thresholds/thresholds.queries'

const STORAGE_KEY = 'thresholdsBannerDismissedUntil'

export function useThresholdsBanner() {
  const { t } = useTranslation('shared-components', { keyPrefix: 'thresholdsBanner' })
  const { data } = useQuery(ThresholdsQueries.getThresholdsJson())

  const { isOpen, closeBanner } = useBaseBanner({
    data,
    storageKey: STORAGE_KEY,
    bannerKey: 'thresholds',
    priority: 2, // lower than maintenance banner
  })

  const text = t('body')
  const title = t('title')

  return { title, text, isOpen, closeBanner }
}
