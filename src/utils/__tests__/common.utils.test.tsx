import React from 'react'
import type { ActionItem } from '@/types/common.types'
import { renderHook } from '@testing-library/react'
import { vi, vitest } from 'vitest'
import {
  clearExponentialInterval,
  createContext,
  formatTopSideActions,
  setExponentialInterval,
} from '../common.utils'

describe('testing formatTopSideActions utility function', () => {
  it('should return undefined if no actions are passed', () => {
    const result = formatTopSideActions([])
    expect(result).toBe(undefined)
  })

  it('should return the first action as a button', () => {
    const actionMocks: Array<ActionItem> = [{ label: 'testLabel', action: vi.fn() }]
    const result = formatTopSideActions(actionMocks)
    expect(result?.buttons).toHaveLength(1)
    expect(result?.actionMenu).toBe(undefined)
  })

  it('should return the first action as a button and the rest inside the action menu', () => {
    const actionMocks: Array<ActionItem> = [
      { label: 'labelButton', action: vi.fn() },
      { label: 'labelActionMenu1', action: vi.fn() },
      { label: 'labelActionMenu2', action: vi.fn() },
    ]
    const result = formatTopSideActions(actionMocks)
    expect(result?.buttons).toHaveLength(1)
    expect(result?.actionMenu).toHaveLength(2)

    const actionButton = result?.buttons?.find((action) => action.label === 'labelButton')
    expect(actionButton).toBeTruthy()

    const action1 = result?.actionMenu?.find((action) => action.label === 'labelActionMenu1')
    expect(action1).toBeTruthy()

    const action2 = result?.actionMenu?.find((action) => action.label === 'labelActionMenu2')
    expect(action2).toBeTruthy()
  })
})

describe('testing createContext utility function', () => {
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

describe('setExponentialInterval tests', () => {
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
