import { renderHook } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useActiveStep } from '../useActiveStep'
import * as reactRouterDom from 'react-router-dom'
import { vi } from 'vitest'

vi.mock('react-router-dom')
const useLocationSpy = vi.spyOn(reactRouterDom, 'useLocation')

type UseLocationReturn = ReturnType<typeof reactRouterDom.useLocation>

describe('useActiveStep hook testing', () => {
  it('should update the state correctly', () => {
    useLocationSpy.mockImplementation(() => ({} as UseLocationReturn))

    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { result } = renderHook(() => useActiveStep())

    expect(result.current.activeStep).toBe(0)
    act(() => {
      result.current.forward()
    })
    expect(scrollSpy).toBeCalledTimes(1)
    expect(result.current.activeStep).toBe(1)
    act(() => {
      result.current.back()
    })
    expect(scrollSpy).toBeCalledTimes(1)
    expect(result.current.activeStep).toBe(0)
  })

  it('should sync the initial step state with the location state', () => {
    useLocationSpy.mockImplementation(
      () => ({ state: { stepIndexDestination: 2 } } as UseLocationReturn)
    )
    const { result } = renderHook(() => useActiveStep())

    expect(result.current.activeStep).toBe(2)
  })

  it('should not set the step index below to zero', () => {
    useLocationSpy.mockImplementation(() => ({} as UseLocationReturn))
    const { result } = renderHook(() => useActiveStep())

    expect(result.current.activeStep).toBe(0)
    act(() => {
      result.current.back()
    })
    expect(result.current.activeStep).toBe(0)
  })
})
