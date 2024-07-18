import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { useMaintenanceBanner } from '../useMaintenanceBanner'
import { type Mock, vi } from 'vitest'
import subDays from 'date-fns/subDays'
import addDays from 'date-fns/addDays'
import lightFormat from 'date-fns/lightFormat'
import { act } from 'react-dom/test-utils'

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: vi.fn(),
  useQueries: vi.fn(),
}))

import { useQuery } from '@tanstack/react-query'

function renderUseMaintenanceBannerHook() {
  return renderHookWithApplicationContext(() => useMaintenanceBanner(), {
    withReactQueryContext: true,
  })
}

describe('useMaintenanceBanner', () => {
  it('should return text for multipleDays if maintenance data interval more than one day long', () => {
    ;(useQuery as Mock).mockReturnValue({
      data: {
        start: {
          date: '2023-05-15',
          time: '17:00',
        },
        end: {
          date: '2023-05-17',
          time: '14:00',
        },
      },
      isFetching: false,
    })
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.text).toBe('bodyMultipleDay')
  })

  it('should return text for singleDay if maintenance data interval is one day or less long', () => {
    ;(useQuery as Mock).mockReturnValue({
      data: {
        start: {
          date: '2023-05-16',
          time: '09:00',
        },
        end: {
          date: '2023-05-16',
          time: '19:00',
        },
      },
      isFetching: false,
    })
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.text).toBe('bodySingleDay')
  })

  it('should be defined closeBanner', () => {
    ;(useQuery as Mock).mockReturnValue({
      data: {
        start: {
          date: '2023-05-15',
          time: '17:00',
        },
        end: {
          date: '2023-05-17',
          time: '14:00',
        },
      },
      isFetching: false,
    })
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.closeBanner).toBeDefined()
  })

  it('isOpen should be false and end date should be save in localStorage if closeBanner is executed', () => {
    ;(useQuery as Mock).mockReturnValue({
      data: {
        start: {
          date: '2023-05-15',
          time: '17:00',
        },
        end: {
          date: '2023-05-17',
          time: '14:00',
        },
      },
      isFetching: false,
    })
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const { result } = renderUseMaintenanceBannerHook()

    act(() => {
      result.current.closeBanner()
    })

    expect(result.current.isOpen).toBe(false)
    expect(setItem).toBeCalled()
  })

  it('isOpen should be false if data is undefined', () => {
    ;(useQuery as Mock).mockReturnValue({
      data: undefined,
      isFetching: false,
    })
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if data has only start', () => {
    ;(useQuery as Mock).mockReturnValue({
      data: {
        start: {
          date: '2023-05-15',
          time: '17:00',
        },
      },
      isFetching: false,
    })
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if data has only end', () => {
    ;(useQuery as Mock).mockReturnValue({
      data: {
        end: {
          date: '2023-05-15',
          time: '17:00',
        },
      },
      isFetching: false,
    })
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if the banner was already seen (the end is in localStorage)', () => {
    ;(useQuery as Mock).mockReturnValue({
      data: {
        start: {
          date: '2023-05-15',
          time: '17:00',
        },
        end: {
          date: '2023-05-17',
          time: '14:00',
        },
      },
      isFetching: false,
    })
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('2023-05-17 14:00')
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if now is not in the interval', () => {
    ;(useQuery as Mock).mockReturnValue({
      data: {
        start: {
          date: '2023-05-15',
          time: '17:00',
        },
        end: {
          date: '2023-05-15',
          time: '19:00',
        },
      },
      isFetching: false,
    })
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be true if now is in the interval', () => {
    const now = Date.now()
    const start = subDays(now, 1)
    const startString = lightFormat(start, 'yyyy-MM-dd')
    const end = addDays(now, 2)
    const endString = lightFormat(end, 'yyyy-MM-dd')
    ;(useQuery as Mock).mockReturnValue({
      data: {
        start: {
          date: startString,
          time: '00:00',
        },
        end: {
          date: endString,
          time: '23:59',
        },
      },
      isFetching: false,
    })
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(true)
  })
})
