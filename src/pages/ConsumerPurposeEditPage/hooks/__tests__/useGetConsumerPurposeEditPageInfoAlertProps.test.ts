import { renderHook } from '@testing-library/react'
import { useGetConsumerPurporseEditPageInfoAlertProps } from '../useGetConsumerPurporseEditPageInfoAlertProps'

describe('useGetConsumerPurposeInfoAlertProps', () => {
  it('should return undefined if there is no exceed', () => {
    const { result } = renderHook(() => useGetConsumerPurporseEditPageInfoAlertProps(1, 10, 100))
    expect(result.current).toStrictEqual(undefined)
  })
  it('should return infoDailyCallsPerConsumerExceed if dailyCalls > dailyCallsPerConsumer', () => {
    const { result } = renderHook(() => useGetConsumerPurporseEditPageInfoAlertProps(11, 10, 100))
    expect(result.current).toStrictEqual({
      children: 'infoDailyCallsPerConsumerExceed',
      severity: 'info',
    })
  })
  it('should return isDailyCallsTotalExceed if dailyCalls > dailyCallsTotal', () => {
    const { result } = renderHook(() => useGetConsumerPurporseEditPageInfoAlertProps(111, 10, 100))
    expect(result.current).toStrictEqual({
      children: 'infoDailyCallsTotalExceed',
      severity: 'info',
    })
  })
})
