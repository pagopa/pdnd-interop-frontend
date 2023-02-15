import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useAutocompleteFilterInput } from '../useAutocompleteFilterInput'

vi.useFakeTimers()

describe('useAutocompleteFilterInput hooks tests', () => {
  it('should not update the state if an input with length less than 3 is given', async () => {
    const { result } = renderHook(() => useAutocompleteFilterInput())

    expect(result.current[0]).toBe('')
    vi.advanceTimersByTime(300)
    act(() => {
      result.current[1](undefined, 't')
      vi.advanceTimersByTime(300)
    })
    expect(result.current[0]).toBe('')
    act(() => {
      result.current[1](undefined, 'te')
      vi.advanceTimersByTime(300)
    })
    expect(result.current[0]).toBe('')
    act(() => {
      result.current[1](undefined, 'tes')
      vi.advanceTimersByTime(300)
    })
    expect(result.current[0]).toEqual('tes')
    act(() => {
      result.current[1](undefined, 'test')
      vi.advanceTimersByTime(300)
    })
    expect(result.current[0]).toEqual('test')
  })
})
