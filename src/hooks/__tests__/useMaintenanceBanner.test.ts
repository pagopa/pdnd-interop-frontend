import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { type MaintenanceData, useMaintenanceBanner } from '../useMaintenanceBanner'
import { vi } from 'vitest'
import * as hooks from '@/api/maintenance'
import type { UseQueryResult } from '@tanstack/react-query'
import subDays from 'date-fns/subDays'
import addDays from 'date-fns/addDays'
import lightFormat from 'date-fns/lightFormat'
import { act } from 'react-dom/test-utils'

function renderUseMaintenanceBannerHook() {
  return renderHookWithApplicationContext(() => useMaintenanceBanner(), {
    withReactQueryContext: true,
  })
}

describe('useMaintenanceBanner', () => {
  it('should return text for multipleDays if maintenance data interval more than one day long', () => {
    vi.spyOn(hooks, 'useGetMaintenanceJson').mockReturnValue({
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
    } as UseQueryResult<MaintenanceData, unknown>)
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.text).toBe('bodyMultipleDay')
  })

  it('should return text for singleDay if maintenance data interval is one day or less long', () => {
    vi.spyOn(hooks, 'useGetMaintenanceJson').mockReturnValue({
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
    } as UseQueryResult<MaintenanceData, unknown>)
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.text).toBe('bodySingleDay')
  })

  it('should be defined closeBanner', () => {
    vi.spyOn(hooks, 'useGetMaintenanceJson').mockReturnValue({
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
    } as UseQueryResult<MaintenanceData, unknown>)
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.closeBanner).toBeDefined()
  })

  it('isOpen should be false and end date should be save in localStorage if closeBanner is executed', () => {
    vi.spyOn(hooks, 'useGetMaintenanceJson').mockReturnValue({
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
    } as UseQueryResult<MaintenanceData, unknown>)
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const { result } = renderUseMaintenanceBannerHook()

    act(() => {
      result.current.closeBanner()
    })

    expect(result.current.isOpen).toBe(false)
    expect(setItem).toBeCalled()
  })

  it('isOpen should be false if data is undefined', () => {
    vi.spyOn(hooks, 'useGetMaintenanceJson').mockReturnValue({
      data: undefined,
      isFetching: false,
    } as UseQueryResult<MaintenanceData, unknown>)
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if data has only start', () => {
    vi.spyOn(hooks, 'useGetMaintenanceJson').mockReturnValue({
      data: {
        start: {
          date: '2023-05-15',
          time: '17:00',
        },
      },
      isFetching: false,
    } as UseQueryResult<MaintenanceData, unknown>)
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if data has only end', () => {
    vi.spyOn(hooks, 'useGetMaintenanceJson').mockReturnValue({
      data: {
        end: {
          date: '2023-05-15',
          time: '17:00',
        },
      },
      isFetching: false,
    } as UseQueryResult<MaintenanceData, unknown>)
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if the banner was already seen (the end is in localStorage)', () => {
    vi.spyOn(hooks, 'useGetMaintenanceJson').mockReturnValue({
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
    } as UseQueryResult<MaintenanceData, unknown>)
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('2023-05-17 14:00')
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be false if now is not in the interval', () => {
    vi.spyOn(hooks, 'useGetMaintenanceJson').mockReturnValue({
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
    } as UseQueryResult<MaintenanceData, unknown>)
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(false)
  })

  it('isOpen should be true if now is in the interval', () => {
    const now = Date.now()
    const start = subDays(now, 1)
    const startString = lightFormat(start, 'yyyy-MM-dd')
    const end = addDays(now, 2)
    const endString = lightFormat(end, 'yyyy-MM-dd')
    vi.spyOn(hooks, 'useGetMaintenanceJson').mockReturnValue({
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
    } as UseQueryResult<MaintenanceData, unknown>)
    const { result } = renderUseMaintenanceBannerHook()

    expect(result.current.isOpen).toBe(true)
  })
})
