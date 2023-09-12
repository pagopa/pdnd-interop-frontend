import { act, renderHook } from '@testing-library/react'
import { useDrawerState } from '../useDrawerState'

describe('useDrawerState', () => {
  it('should return the drawer state and the functions to open and close it', () => {
    const { result } = renderHook(() => useDrawerState())

    expect(result.current).toEqual({
      isOpen: false,
      openDrawer: expect.any(Function),
      closeDrawer: expect.any(Function),
    })
  })

  describe('openDrawer', () => {
    it('should set the drawer state to true', () => {
      const { result } = renderHook(() => useDrawerState())

      act(() => {
        result.current.openDrawer()
      })

      expect(result.current.isOpen).toBe(true)
    })
  })

  describe('closeDrawer', () => {
    it('should set the drawer state to false', () => {
      const { result } = renderHook(() => useDrawerState())

      act(() => {
        result.current.openDrawer()
      })

      expect(result.current.isOpen).toBe(true)

      act(() => {
        result.current.closeDrawer()
      })

      expect(result.current.isOpen).toBe(false)
    })
  })
})
