import { useQuery } from '@tanstack/react-query'
import { useBaseBanner } from './useBaseBanner'
import { ProductUpdatesQueries } from '@/api/productUpdates/productUpdates.queries'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'productUpdatesBannerDismissedUntil'

export function useProductUpdatesBanner() {
  const { i18n } = useTranslation()
  const { data } = useQuery(ProductUpdatesQueries.getProductUpdatesJson(i18n.language))

  const { isOpen, closeBanner } = useBaseBanner({
    data,
    storageKey: STORAGE_KEY,
    bannerKey: 'productUpdates',
    priority: 2, // lower than maintenance banner
  })

  return {
    title: data?.title ?? '',
    text: data?.description ?? '',
    firstLink: data?.firstLink,
    secondLink: data?.secondLink,
    isOpen,
    closeBanner,
  }
}
