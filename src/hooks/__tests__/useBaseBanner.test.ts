import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { useBaseBanner } from '../bannerHooks/useBaseBanner'
import { vi, beforeEach, afterEach } from 'vitest'
import addDays from 'date-fns/addDays'
import lightFormat from 'date-fns/lightFormat'
import { act } from '@testing-library/react'
import { useBannerStore } from '@/stores/banner.store'

const STORAGE_KEY = 'test-banner'

const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

const createBannerData = (
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
) => ({
  start: { date: startDate, time: startTime },
  end: { date: endDate, time: endTime },
})

const createDateRange = (startDaysOffset: number, endDaysOffset: number) => {
  const now = Date.now()
  const start = addDays(now, startDaysOffset)
  const end = addDays(now, endDaysOffset)
  return {
    startString: lightFormat(start, 'yyyy-MM-dd'),
    endString: lightFormat(end, 'yyyy-MM-dd'),
    startTime: startDaysOffset === 0 ? lightFormat(now, 'HH:mm') : '00:00',
    endTime: '23:59',
  }
}

function renderUseBaseBannerHook(data: any, bannerKey: string, priority: number) {
  return renderHookWithApplicationContext(
    () =>
      useBaseBanner({
        data,
        storageKey: STORAGE_KEY,
        bannerKey,
        priority,
      }),
    {
      withReactQueryContext: true,
    }
  )
}

describe('useBaseBanner', () => {
  beforeEach(() => {
    localStorageMock.clear()
    useBannerStore.setState({ currentBanner: null })
  })

  afterEach(() => {
    localStorageMock.clear()
    useBannerStore.setState({ currentBanner: null })
  })

  it('should return multipleDays durationType if interval is more than one day', () => {
    const data = createBannerData('2023-05-15', '17:00', '2023-05-17', '14:00')
    const { result } = renderUseBaseBannerHook(data, 'test-banner', 2)

    expect(result.current.bannerInfo?.durationType).toBe('multiple')
  })

  it('should return singleDay durationType if interval is one day or less', () => {
    const data = createBannerData('2023-05-16', '09:00', '2023-05-16', '19:00')
    const { result } = renderUseBaseBannerHook(data, 'test-banner', 2)

    expect(result.current.bannerInfo?.durationType).toBe('single')
  })

  it('should set isOpen to false and save end date to localStorage when closed', () => {
    const data = createBannerData('2023-05-15', '17:00', '2023-05-17', '14:00')
    const setItemSpy = vi.spyOn(localStorageMock, 'setItem')
    const { result } = renderUseBaseBannerHook(data, 'test-banner', 2)

    act(() => {
      result.current.closeBanner()
    })

    expect(result.current.isOpen).toBe(false)
    expect(setItemSpy).toBeCalled()
    setItemSpy.mockRestore()
  })

  it('should not show banner if data is undefined', () => {
    const { result } = renderUseBaseBannerHook(undefined, 'test-banner', 2)

    expect(result.current.isOpen).toBe(false)
  })

  it('should not show banner if already dismissed (stored in localStorage)', () => {
    const data = createBannerData('2023-05-15', '17:00', '2023-05-17', '14:00')
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('2023-05-17 14:00')
    const { result } = renderUseBaseBannerHook(data, 'test-banner', 2)

    expect(result.current.isOpen).toBe(false)
  })

  it('should not show banner if current time is outside the configured interval', () => {
    const data = createBannerData('2023-05-15', '17:00', '2023-05-15', '19:00')
    const { result } = renderUseBaseBannerHook(data, 'test-banner', 2)

    expect(result.current.isOpen).toBe(false)
  })

  it('should show banner if current time is within the configured interval', () => {
    const { startString, endString, startTime, endTime } = createDateRange(-1, 2)
    const data = createBannerData(startString, startTime, endString, endTime)
    const { result } = renderUseBaseBannerHook(data, 'test-banner', 2)

    expect(result.current.isOpen).toBe(true)
  })

  it('should show higher priority banner when both are valid', () => {
    const { startString, endString, startTime, endTime } = createDateRange(-1, 2)
    const data = createBannerData(startString, startTime, endString, endTime)

    const { result: highPriorityResult } = renderUseBaseBannerHook(data, 'maintenance', 1)
    const { result: lowPriorityResult } = renderUseBaseBannerHook(data, 'notification', 2)

    expect(highPriorityResult.current.isOpen).toBe(true)
    expect(lowPriorityResult.current.isOpen).toBe(false)
  })

  it('should show lower priority banner after higher priority banner is dismissed', () => {
    const { startString, endString, startTime, endTime } = createDateRange(-1, 2)
    const maintenanceData = createBannerData(startString, startTime, endString, endTime)
    const notificationData = createBannerData(startString, startTime, endString, endTime)

    // high priority banner
    const { result: highPriorityResult, unmount: unmountHigh } = renderHookWithApplicationContext(
      () =>
        useBaseBanner({
          data: maintenanceData,
          storageKey: 'maintenance-priority-test',
          bannerKey: 'maintenance',
          priority: 1,
        }),
      { withReactQueryContext: true }
    )
    expect(highPriorityResult.current.isOpen).toBe(true)
    expect(useBannerStore.getState().currentBanner?.bannerKey).toBe('maintenance')

    act(() => {
      highPriorityResult.current.closeBanner()
    })

    expect(useBannerStore.getState().currentBanner).toBeNull()
    unmountHigh()

    // low priority banner should show since high priority has been closed
    const { result: lowPriorityResult } = renderHookWithApplicationContext(
      () =>
        useBaseBanner({
          data: notificationData,
          storageKey: 'notification-priority-test',
          bannerKey: 'notification',
          priority: 2,
        }),
      { withReactQueryContext: true }
    )
    expect(lowPriorityResult.current.isOpen).toBe(true)
  })

  it('should clear currentBanner in store when banner is closed', () => {
    const { startString, endString, startTime, endTime } = createDateRange(-1, 2)
    const data = createBannerData(startString, startTime, endString, endTime)

    const { result } = renderUseBaseBannerHook(data, 'store-clear-test', 2)
    expect(result.current.isOpen).toBe(true)
    expect(useBannerStore.getState().currentBanner).toEqual({
      bannerKey: 'store-clear-test',
      priority: 2,
    })

    act(() => {
      result.current.closeBanner()
    })

    expect(useBannerStore.getState().currentBanner).toBeNull()
  })

  it('should not show banner if dismissed, even if within time window', () => {
    const storageKey = 'dismissed-test-banner'
    const { startString, endString, startTime, endTime } = createDateRange(-1, 2)
    const data = createBannerData(startString, startTime, endString, endTime)

    // 1° render = banner shows
    const { result, unmount } = renderHookWithApplicationContext(
      () => useBaseBanner({ data, storageKey, bannerKey: 'dismissed-banner', priority: 2 }),
      { withReactQueryContext: true }
    )
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.closeBanner()
    })

    unmount()
    useBannerStore.setState({ currentBanner: null })

    // 2° render = banner should not show because localStorage flag
    const { result: result2 } = renderHookWithApplicationContext(
      () => useBaseBanner({ data, storageKey, bannerKey: 'dismissed-banner', priority: 2 }),
      { withReactQueryContext: true }
    )
    expect(result2.current.isOpen).toBe(false)
  })

  it('should show banner again if config changes after dismissal', () => {
    const { startString, startTime } = createDateRange(-1, 2)
    const data = createBannerData(
      startString,
      startTime,
      lightFormat(addDays(Date.now(), 2), 'yyyy-MM-dd'),
      '23:59'
    )

    const { result } = renderUseBaseBannerHook(data, 'test-banner', 2)
    act(() => {
      result.current.closeBanner()
    })

    // config changes with different end date
    const newData = createBannerData(
      startString,
      startTime,
      lightFormat(addDays(Date.now(), 3), 'yyyy-MM-dd'),
      '23:59'
    )
    const { result: result2 } = renderUseBaseBannerHook(newData, 'test-banner', 2)

    expect(result2.current.isOpen).toBe(true)
  })
})

