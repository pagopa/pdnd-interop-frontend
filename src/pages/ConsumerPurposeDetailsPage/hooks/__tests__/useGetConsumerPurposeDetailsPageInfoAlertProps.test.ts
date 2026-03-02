import { renderHook } from '@testing-library/react'
import { useGetConsumerPurposeDetailsPageInfoAlertProps } from '../useGetConsumerPurposeDetailsPageInfoAlertProps'

describe('useGetConsumerPurposeDetailsPageInfoAlertProps', () => {
  it('should return undefined if there is no exceed', () => {
    const { result } = renderHook(() => useGetConsumerPurposeDetailsPageInfoAlertProps(1, 10, 100))
    expect(result.current).toStrictEqual(undefined)
  })
  it('should return infoDailyCallsPerConsumerExceed if dailyCalls > dailyCallsPerConsumer', () => {
    const { result } = renderHook(() => useGetConsumerPurposeDetailsPageInfoAlertProps(11, 10, 100))
    expect(result.current).toStrictEqual({
      children: 'infoDailyCallsPerConsumerExceed',
      severity: 'info',
    })
  })
  it('should return infoDailyCallsTotalExceed if dailyCalls > dailyCallsTotal', () => {
    const { result } = renderHook(() =>
      useGetConsumerPurposeDetailsPageInfoAlertProps(111, 10, 100)
    )
    expect(result.current).toStrictEqual({
      children: 'infoDailyCallsTotalExceed',
      severity: 'info',
    })
  })
})
