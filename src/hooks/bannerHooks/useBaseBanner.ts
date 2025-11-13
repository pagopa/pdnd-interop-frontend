import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import isBefore from 'date-fns/isBefore'
import { match } from 'ts-pattern'
import { STAGE } from '@/config/env'
import {
  formatBannerDate,
  calculateBannerDuration,
  getBannerDurationType,
  getBannerTimestamps,
  type BannerData,
} from './utils'

interface UseBaseBannerProps {
  data: BannerData | undefined
  storageKey: string
  translationKeyPrefix: string
}

export function useBaseBanner({ data, storageKey, translationKeyPrefix }: UseBaseBannerProps) {
  const { t } = useTranslation('shared-components', {
    keyPrefix: translationKeyPrefix as any,
  })

  const timestamps = useMemo(() => getBannerTimestamps(data), [data])

  const [isOpen, setIsOpen] = useState(false)

  const bannerInfo = useMemo(() => {
    if (!timestamps) return null

    const durationInHours = calculateBannerDuration(
      timestamps.startTimestamp,
      timestamps.endTimestamp
    )
    const durationType = getBannerDurationType(durationInHours)

    return {
      ...timestamps,
      durationInHours,
      durationType,
    }
  }, [timestamps])

  const closeBanner = useCallback(() => {
    setIsOpen(false)
    if (bannerInfo) {
      localStorage.setItem(storageKey, bannerInfo.endString)
    }
  }, [bannerInfo, storageKey])

  useEffect(() => {
    if (!bannerInfo) {
      setIsOpen(false)
      return
    }

    const lastViewed = localStorage.getItem(storageKey)
    if (lastViewed === bannerInfo.endString) {
      setIsOpen(false)
      return
    }

    setIsOpen(isBefore(Date.now(), bannerInfo.endTimestamp))
  }, [bannerInfo, storageKey])

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
        .with('PROD', () => t('titleProdEnv'))
        .with('ATT', () => t('titleAttEnv'))
        .with('UAT', () => t('titleTestEnv'))
        .otherwise(() => null),
    [t]
  )

  return { title, text, isOpen, closeBanner }
}
