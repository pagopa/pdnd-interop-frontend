import { renderHook } from '@testing-library/react'
import { useGetDebugVoucherResultChipProps } from '../useGetDebugVoucherResultChipProps'
import { createMockDebugVoucherResultStep } from '@/../__mocks__/data/voucher.mocks'

describe('useGetDebugVoucherResultChipProps hook testing', () => {
  it('should return undefined if step is undefined', () => {
    const { result } = renderHook(() => useGetDebugVoucherResultChipProps())

    expect(result.current).toBeUndefined()
  })

  it('should return correclty if step is PASSED', () => {
    const passedStep = createMockDebugVoucherResultStep({ result: 'PASSED', failures: [] })
    const { result } = renderHook(() => useGetDebugVoucherResultChipProps(passedStep))

    expect(result.current?.label).toBe('chipLabel.passed')
    expect(result.current?.color).toBe('success')
  })

  it('should return correclty if step is SKIPPED', () => {
    const skippedStep = createMockDebugVoucherResultStep({ result: 'SKIPPED', failures: [] })
    const { result } = renderHook(() => useGetDebugVoucherResultChipProps(skippedStep))

    expect(result.current?.label).toBe('chipLabel.skipped')
    expect(result.current?.color).toBe('warning')
  })

  it('should return correclty if step is FAILED', () => {
    const failedStep = createMockDebugVoucherResultStep()
    const { result } = renderHook(() => useGetDebugVoucherResultChipProps(failedStep))

    expect(result.current?.label).toBe('chipLabel.failed')
    expect(result.current?.color).toBe('error')
  })
})
