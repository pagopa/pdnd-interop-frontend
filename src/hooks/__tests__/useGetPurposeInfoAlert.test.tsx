import { renderHook } from '@testing-library/react'
import { useGetPurposeInfoAlert } from '../useGetPurposeInfoAlert'
import type { KeyPrefix } from 'i18next'

const defaultMockData = {
  dailyCalls: 5,
  dailyCallsPerConsumer: 10,
  dailyCallsTotal: 15,
  remainingDailyCallsPerConsumer: 10,
  remainingDailyCallsTotal: 15,
  keyPrefix: 'test' as KeyPrefix<'purpose'>,
  showFallback: false,
}

describe('useGetPurposeInfoAlert', () => {
  it('should return infoDailyCallsMaximumReached if dailyCalls limits are zero', () => {
    const { result } = renderHook(() => {
      const mockData = {
        ...defaultMockData,
        remainingDailyCallsPerConsumer: 0,
        remainingDailyCallsTotal: 0,
      }
      return useGetPurposeInfoAlert(mockData)
    })
    expect(result.current).toStrictEqual({
      severity: 'info',
      children: 'infoDailyCallsMaximumReached',
    })
  })

  it('should return infoDailyCallsTotalResidualExceed if dailyCalls > remainingDailyCallsTotal', () => {
    const { result } = renderHook(() => {
      const mockData = {
        ...defaultMockData,
        dailyCalls: 2,
        remainingDailyCallsPerConsumer: 100,
        remainingDailyCallsTotal: 1,
      }
      return useGetPurposeInfoAlert(mockData)
    })
    expect(result.current).toStrictEqual({
      severity: 'info',
      children: 'infoDailyCallsTotalResidualExceed',
    })
  })

  it('should return infoDailyCallsPerConsumerResidualExceed if dailyCalls > remainingDailyCallsPerConsumer', () => {
    const { result } = renderHook(() => {
      const mockData = {
        ...defaultMockData,
        dailyCalls: 2,
        remainingDailyCallsPerConsumer: 1,
        remainingDailyCallsTotal: 100,
      }
      return useGetPurposeInfoAlert(mockData)
    })
    expect(result.current).toStrictEqual({
      severity: 'info',
      children: 'infoDailyCallsPerConsumerResidualExceed',
    })
  })

  it('should return infoDailyCallsTotalExceed if dailyCalls > dailyCallsTotal', () => {
    const { result } = renderHook(() => {
      const mockData = {
        ...defaultMockData,
        dailyCalls: 20,
        dailyCallsTotal: 15,
        remainingDailyCallsPerConsumer: undefined,
        remainingDailyCallsTotal: undefined,
      }
      return useGetPurposeInfoAlert(mockData)
    })
    expect(result.current).toStrictEqual({
      severity: 'info',
      children: 'infoDailyCallsTotalExceed',
    })
  })

  it('should return infoDailyCallsPerConsumerExceed if dailyCalls > dailyCallsPerConsumer', () => {
    const { result } = renderHook(() => {
      const mockData = {
        ...defaultMockData,
        dailyCalls: 12,
        dailyCallsPerConsumer: 10,
        dailyCallsTotal: 100,
        remainingDailyCallsPerConsumer: undefined,
        remainingDailyCallsTotal: undefined,
      }
      return useGetPurposeInfoAlert(mockData)
    })
    expect(result.current).toStrictEqual({
      severity: 'info',
      children: 'infoDailyCallsPerConsumerExceed',
    })
  })

  it('should return fallback info if showFallback is true', () => {
    const { result } = renderHook(() => {
      const mockData = {
        ...defaultMockData,
        showFallback: true,
        remainingDailyCallsPerConsumer: undefined,
        remainingDailyCallsTotal: undefined,
        dailyCalls: 5,
        dailyCallsPerConsumer: 10,
        dailyCallsTotal: 100,
      }
      return useGetPurposeInfoAlert(mockData)
    })
    expect(result.current).toStrictEqual({
      severity: 'info',
      children: 'infoApprovalMayBeRequired',
    })
  })

  it('should return undefined if no condition is met', () => {
    const { result } = renderHook(() => {
      const mockData = { ...defaultMockData }
      return useGetPurposeInfoAlert(mockData)
    })
    expect(result.current).toBeUndefined()
  })
})
