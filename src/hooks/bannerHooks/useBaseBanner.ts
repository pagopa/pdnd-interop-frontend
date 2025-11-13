import { useCallback, useEffect, useMemo, useState } from 'react'
import isBefore from 'date-fns/isBefore'
import {
  calculateBannerDuration,
  getBannerDurationType,
  getBannerTimestamps,
  type BannerData,
  type BannerDurationType,
} from './utils'

export interface BannerInfo {
  startString: string
  endString: string
  startTimestamp: number
  endTimestamp: number
  durationInHours: number
  durationType: BannerDurationType
}

interface UseBaseBannerProps {
  data: BannerData | undefined
  storageKey: string
}

interface UseBaseBannerReturn {
  isOpen: boolean
  closeBanner: () => void
  bannerInfo: BannerInfo | null
}

export function useBaseBanner({ data, storageKey }: UseBaseBannerProps): UseBaseBannerReturn {
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

  return { isOpen, closeBanner, bannerInfo }
}
