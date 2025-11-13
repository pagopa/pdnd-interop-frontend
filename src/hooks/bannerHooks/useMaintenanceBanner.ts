import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { MaintenanceQueries } from '@/api/maintenance'
import { STAGE } from '@/config/env'
import { useBaseBanner } from './useBaseBanner'
import { formatBannerDate } from './utils'

const STORAGE_KEY = 'lastMaintenanceViewed'

export function useMaintenanceBanner() {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'maintenanceBanner',
  })
  const { data } = useQuery(MaintenanceQueries.getMaintenanceJson())

  const { isOpen, closeBanner, bannerInfo } = useBaseBanner({
    data,
    storageKey: STORAGE_KEY,
  })

  const text = useMemo(() => {
    if (!data?.start || !data?.end || !bannerInfo) return ''

    return bannerInfo.durationType === 'single'
      ? t('bodySingleDay', {
          maintenanceStartDay: formatBannerDate(data.start.date, 'single'),
          maintenanceStartHour: data.start.time,
          hoursDuration: bannerInfo.durationInHours,
        })
      : t('bodyMultipleDay', {
          maintenanceStartHour: data.start.time,
          maintenanceStartDay: formatBannerDate(data.start.date, 'multiple'),
          maintenanceEndHour: data.end.time,
          maintenanceEndDay: formatBannerDate(data.end.date, 'multiple'),
        })
  }, [data, bannerInfo, t])

  const title = useMemo(
    () =>
      match(STAGE)
        .with('DEV', () => 'Manutenzione in ambiente di sviluppo')
        .with('PROD', () => t('titleProdEnv'))
        .with('ATT', () => t('titleAttEnv'))
        .with('UAT', () => t('titleTestEnv'))
        .otherwise(() => null),
    [t]
  )

  return { title, text, isOpen, closeBanner }
}
