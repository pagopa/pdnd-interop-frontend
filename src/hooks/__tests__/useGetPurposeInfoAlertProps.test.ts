import { renderHook } from '@testing-library/react'
import { useGetPurposeInfoAlertProps } from '../useGetPurposeInfoAlertProps'

describe('useGetPurposeInfoAlertProps', () => {
  it('should return undefined if there is no exceed', () => {
    const { result } = renderHook(() => useGetPurposeInfoAlertProps(1, 10, 100))
    expect(result.current).toStrictEqual(undefined)
  })
  it('should return infoDailyCallsPerConsumerExceed if dailyCalls > dailyCallsPerConsumer', () => {
    const { result } = renderHook(() => useGetPurposeInfoAlertProps(11, 10, 100))
    expect(result.current).toStrictEqual({
      children: 'infoDailyCallsPerConsumerExceed',
      severity: 'info',
    })
  })
  it('should return infoDailyCallsTotalExceed if dailyCalls > dailyCallsTotal', () => {
    const { result } = renderHook(() => useGetPurposeInfoAlertProps(111, 10, 100))
    expect(result.current).toStrictEqual({
      children: 'infoDailyCallsTotalExceed',
      severity: 'info',
    })
  })
})
