import { renderHook } from '@testing-library/react'
import { useGetPurposeInfoAlert } from '../useGetPurposeInfoAlert'
import type { KeyPrefix } from 'i18next'

const defaultMockData = {
  dailyCalls: 5,
  dailyCallsPerConsumer: 10,
  dailyCallsTotal: 15,
  updatedDailyCallsPerConsumer: 10,
  updatedDailyCallsTotal: 15,
  keyPrefix: 'test' as KeyPrefix<'purpose'>,
  showFallback: false,
}

describe('useGetPurposeInfoAlert', () => {
  it('should return infoDailyCallsMaximumReached if dailyCalls limits are zero', () => {
    const { result } = renderHook(() => {
      const mockData = {
        ...defaultMockData,
        updatedDailyCallsPerConsumer: 0,
        updatedDailyCallsTotal: 0,
      }
      return useGetPurposeInfoAlert(mockData)
    })
    expect(result.current).toStrictEqual({
      severity: 'info',
      children: 'infoDailyCallsMaximumReached',
    })
  })

  it('should return infoDailyCallsTotalResidualExceed if dailyCalls > updatedDailyCallsTotal', () => {
    const { result } = renderHook(() => {
      const mockData = {
        ...defaultMockData,
        dailyCalls: 2,
        updatedDailyCallsPerConsumer: 100,
        updatedDailyCallsTotal: 1,
      }
      return useGetPurposeInfoAlert(mockData)
    })
    expect(result.current).toStrictEqual({
      severity: 'info',
      children: 'infoDailyCallsTotalResidualExceed',
    })
  })

  it('should return infoDailyCallsPerConsumerResidualExceed if dailyCalls > updatedDailyCallsPerConsumer', () => {
    const { result } = renderHook(() => {
      const mockData = {
        ...defaultMockData,
        dailyCalls: 2,
        updatedDailyCallsPerConsumer: 1,
        updatedDailyCallsTotal: 100,
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
        updatedDailyCallsPerConsumer: undefined,
        updatedDailyCallsTotal: undefined,
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
        updatedDailyCallsPerConsumer: undefined,
        updatedDailyCallsTotal: undefined,
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
        updatedDailyCallsPerConsumer: undefined,
        updatedDailyCallsTotal: undefined,
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
