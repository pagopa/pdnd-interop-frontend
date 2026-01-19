import { useCallback, useEffect, useMemo, useState } from 'react'
import { getBannerTimestamps, type BannerData } from './utils'
import { useBannerStore } from '@/stores/banner.store'
import type { BannerDurationType } from './utils'
import { calculateBannerDuration, getBannerDurationType } from './utils'

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
  bannerKey: string // banner.store key (e.g., 'maintenance', 'notification')
  priority: number // priority level of the banner
}

interface UseBaseBannerReturn {
  isOpen: boolean
  closeBanner: () => void
  bannerInfo: BannerInfo | null
}

export function useBaseBanner({
  data,
  storageKey,
  bannerKey,
  priority,
}: UseBaseBannerProps): UseBaseBannerReturn {
  const { currentBanner, setCurrentBanner } = useBannerStore()
  const [isOpen, setIsOpen] = useState(false)

  const bannerInfo = useMemo(() => {
    if (!data) return null
    const timestamps = getBannerTimestamps(data)
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
  }, [data])

  const closeBanner = useCallback(() => {
    setIsOpen(false)
    setCurrentBanner(null) // Clear the current banner in Zustand store
    if (bannerInfo) {
      localStorage.setItem(storageKey, bannerInfo.endString)
    }
  }, [bannerInfo, storageKey, setCurrentBanner])

  useEffect(() => {
    if (!bannerInfo) {
      setIsOpen(false)
      return
    }

    const now = Date.now()

    // banner config time window check
    if (now < bannerInfo.startTimestamp || now > bannerInfo.endTimestamp) {
      setIsOpen(false)
      return
    }

    // already dismissed
    const lastViewed = localStorage.getItem(storageKey)
    if (lastViewed === bannerInfo.endString) {
      setIsOpen(false)
      return
    }

    // priority check
    if (
      currentBanner === null ||
      priority < currentBanner.priority ||
      currentBanner.bannerKey === bannerKey
    ) {
      setCurrentBanner({ bannerKey, priority })
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [bannerInfo, storageKey, currentBanner, priority, setCurrentBanner, bannerKey])

  return { isOpen, closeBanner, bannerInfo }
}
