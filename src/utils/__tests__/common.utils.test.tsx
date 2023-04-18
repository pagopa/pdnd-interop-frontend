import React from 'react'
import type { ActionItem } from '@/types/common.types'
import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { createContext, formatOptions, formatTopSideActions } from '../common.utils'

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

describe('testing formatOptions utility function', () => {
  it('should return an empty array if no options are passed', () => {
    const result = formatOptions([])
    expect(result).toEqual([])
  })

  it('should return an empty array if undefined value is passed', () => {
    const result = formatOptions(undefined)
    expect(result).toEqual([])
  })

  it('should return an array of options with the correct structure', () => {
    const options = [
      { id: '1', name: 'test1', other: 'other' },
      { id: '2', name: 'test2', other: 'other' },
    ]
    const result = formatOptions(options)
    expect(result).toHaveLength(2)
    expect(result[0].label).toBe(options[0].name)
    expect(result[0].value).toBe(options[0].id)
    expect(result[1].label).toBe(options[1].name)
    expect(result[1].value).toBe(options[1].id)
  })
})
