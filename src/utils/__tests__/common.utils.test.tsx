import React from 'react'
import { renderHook } from '@testing-library/react'
import { vitest } from 'vitest'
import {
  clearExponentialInterval,
  createContext,
  setExponentialInterval,
  getAllFromPaginated,
} from '../common.utils'

describe.skip('testing createContext utility function', () => {
  it('should not truncate text long less than the given max length', () => {
    const testValue = 'test'
    const { useContext, Provider } = createContext('TestContext', testValue)

    const { result } = renderHook(() => useContext(), {
      wrapper({ children }) {
        return <Provider value={testValue}>{children}</Provider>
      },
    })

    expect(result.current).toBe(testValue)
  })
})

describe.skip('setExponentialInterval tests', () => {
  beforeEach(() => {
    vitest.useFakeTimers()
    vitest.spyOn(global, 'setTimeout')
  })

  it('calls the given function with an exponential interval', async () => {
    const testFn = vitest.fn()
    setExponentialInterval(testFn, 20 * 1000)

    for (let i = 1; i <= 6; i++) {
      expect(testFn).toBeCalledTimes(i - 1)
      expect(setTimeout).toBeCalledTimes(i)
      expect(vitest.getTimerCount()).toBe(1)
      vitest.advanceTimersByTime(2 ** (i + 1) * 100)
      expect(vitest.getTimerCount()).toBe(0)

      await new Promise(process.nextTick)
    }

    expect(setTimeout).toBeCalledTimes(6)
    expect(testFn).toBeCalledTimes(6)
  })

  it('successfully cancels', async () => {
    const testFn = vitest.fn()
    const intervalId = setExponentialInterval(testFn, 20 * 1000)
    clearExponentialInterval(intervalId)
    for (let i = 1; i <= 6; i++) {
      vitest.advanceTimersByTime(2 ** (i + 1) * 100)
      await new Promise(process.nextTick)
    }
    expect(setTimeout).toBeCalledTimes(1)
    expect(testFn).toBeCalledTimes(0)
  })
})

describe('getAllFromPaginated', () => {
  it('should return all items when they fit on a single page', async () => {
    const getPaginatedCall = vi.fn().mockResolvedValue({
      results: [{ id: 1 }, { id: 2 }],
    })

    const result = await getAllFromPaginated(getPaginatedCall)

    expect(result).toEqual([{ id: 1 }, { id: 2 }])
    expect(getPaginatedCall).toHaveBeenCalledTimes(1)
    expect(getPaginatedCall).toHaveBeenCalledWith(0, 50)
  })

  it('should return all items from multiple pages', async () => {
    const getPaginatedCall = vi
      .fn()
      .mockResolvedValueOnce({
        results: Array.from({ length: 50 }, (_, i) => ({ id: i })),
      })
      .mockResolvedValueOnce({
        results: [{ id: 50 }, { id: 51 }],
      })

    const result = await getAllFromPaginated(getPaginatedCall)

    expect(result.length).toBe(52)
    expect(result[51]).toEqual({ id: 51 })
    expect(getPaginatedCall).toHaveBeenCalledTimes(2)
    expect(getPaginatedCall).toHaveBeenNthCalledWith(1, 0, 50)
    expect(getPaginatedCall).toHaveBeenNthCalledWith(2, 50, 50)
  })

  it('should return an empty array if there are no results', async () => {
    const getPaginatedCall = vi.fn().mockResolvedValue({ results: [] })

    const result = await getAllFromPaginated(getPaginatedCall)

    expect(result).toEqual([])
    expect(getPaginatedCall).toHaveBeenCalledTimes(1)
  })

  it('should terminate correctly when the last page has exactly the limit number of items', async () => {
    const getPaginatedCall = vi
      .fn()
      .mockResolvedValueOnce({
        results: Array.from({ length: 50 }, (_, i) => ({ id: i })),
      })
      .mockResolvedValueOnce({
        results: Array.from({ length: 50 }, (_, i) => ({ id: i + 50 })),
      })
      .mockResolvedValueOnce({ results: [] })

    const result = await getAllFromPaginated(getPaginatedCall)

    expect(result.length).toBe(100)
    expect(getPaginatedCall).toHaveBeenCalledTimes(3)
    expect(getPaginatedCall).toHaveBeenNthCalledWith(3, 100, 50)
  })
})
