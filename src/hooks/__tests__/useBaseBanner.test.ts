import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { useBaseBanner } from '../bannerHooks/useBaseBanner'
import { vi } from 'vitest'
import subDays from 'date-fns/subDays'
import addDays from 'date-fns/addDays'
import lightFormat from 'date-fns/lightFormat'
import { act } from 'react-dom/test-utils'

const STORAGE_KEY = 'test-banner'

function renderUseBaseBannerHook(data: any) {
  return renderHookWithApplicationContext(
    () =>
      useBaseBanner({
        data,
        storageKey: STORAGE_KEY,
      }),
    {
      withReactQueryContext: true,
    }
  )
}

describe('useBaseBanner', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return bannerInfo with multipleDays durationType if data interval more than one day long', () => {
    const data = {
      start: {
        date: '2023-05-15',
        time: '17:00',
      },
      end: {
        date: '2023-05-17',
        time: '14:00',
      },
    }
    const { result } = renderUseBaseBannerHook(data)

    expect(result.current.bannerInfo?.durationType).toBe('multiple')
  })

  it('should return bannerInfo with singleDay durationType if data interval is one day or less long', () => {
    const data = {
      start: {
        date: '2023-05-16',
        time: '09:00',
      },
      end: {
        date: '2023-05-16',
        time: '19:00',
      },
    }
    const { result } = renderUseBaseBannerHook(data)

    expect(result.current.bannerInfo?.durationType).toBe('single')
  })

  it('should be defined closeBanner', () => {
    const data = {
      start: {
        date: '2023-05-15',
        time: '17:00',
      },
      end: {
        date: '2023-05-17',
        time: '14:00',
      },
    }
    const { result } = renderUseBaseBannerHook(data)

    expect(result.current.closeBanner).toBeDefined()
  })

  it('isOpen should be false and end date should be saved in localStorage if closeBanner is executed', () => {
    const data = {
      start: {
        date: '2023-05-15',
        time: '17:00',
      },
      end: {
        date: '2023-05-17',
        time: '14:00',
      },
    }
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const { result } = renderUseBaseBannerHook(data)

    act(() => {
      result.current.closeBanner()
    })

    expect(result.current.isOpen).toBe(false)
    expect(setItem).toBeCalled()
  })

  it('isOpen should be false if data is undefined', () => {
    const { result } = renderUseBaseBannerHook(undefined)

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if data has only start', () => {
    const data = {
      start: {
        date: '2023-05-15',
        time: '17:00',
      },
    }
    const { result } = renderUseBaseBannerHook(data)

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if data has only end', () => {
    const data = {
      end: {
        date: '2023-05-15',
        time: '17:00',
      },
    }
    const { result } = renderUseBaseBannerHook(data)

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if the banner was already seen (the end is in localStorage)', () => {
    const data = {
      start: {
        date: '2023-05-15',
        time: '17:00',
      },
      end: {
        date: '2023-05-17',
        time: '14:00',
      },
    }
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('2023-05-17 14:00')
    const { result } = renderUseBaseBannerHook(data)

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if now is not in the interval', () => {
    const data = {
      start: {
        date: '2023-05-15',
        time: '17:00',
      },
      end: {
        date: '2023-05-15',
        time: '19:00',
      },
    }
    const { result } = renderUseBaseBannerHook(data)

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be true if now is in the interval', () => {
    const now = Date.now()
    const start = subDays(now, 1)
    const startString = lightFormat(start, 'yyyy-MM-dd')
    const end = addDays(now, 2)
    const endString = lightFormat(end, 'yyyy-MM-dd')
    const data = {
      start: {
        date: startString,
        time: '00:00',
      },
      end: {
        date: endString,
        time: '23:59',
      },
    }
    const { result } = renderUseBaseBannerHook(data)

    expect(result.current.isOpen).toBe(true)
  })
})
