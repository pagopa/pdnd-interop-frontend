import {
  createMockPurposeCallsPerConsumerExceed,
  createMockPurposeCallsTotalExceed,
  createMockPurposeCallsWithoutExceed,
} from '../../../../../__mocks__/data/purpose.mocks'
import { renderHook } from '@testing-library/react'
import { useGetConsumerPurposeGeneralInfoAlertProps } from '../useGetConsumerPurposeGeneralInfoAlertProps'

describe('useGetConsumerPurposeInfoAlertProps', () => {
  it('should return infoApprovalMayBeRequired if the purpose is undefined', () => {
    const { result } = renderHook(() => useGetConsumerPurposeGeneralInfoAlertProps(undefined))
    expect(result.current).toStrictEqual({
      children: 'infoApprovalMayBeRequired',
      severity: 'info',
    })
  })
  it('should return isDailyCallsTotalExceed if dailyCalls > dailyCallsTotal', () => {
    const { result } = renderHook(() =>
      useGetConsumerPurposeGeneralInfoAlertProps(createMockPurposeCallsTotalExceed())
    )
    expect(result.current).toStrictEqual({
      children: 'infoDailyCallsTotalExceed',
      severity: 'info',
    })
  })
  it('should return infoDailyCallsPerConsumerExceed if dailyCalls > dailyCallsPerConsumer', () => {
    const { result } = renderHook(() =>
      useGetConsumerPurposeGeneralInfoAlertProps(createMockPurposeCallsPerConsumerExceed())
    )
    expect(result.current).toStrictEqual({
      children: 'infoDailyCallsPerConsumerExceed',
      severity: 'info',
    })
  })
  it('should return infoApprovalMayBeRequired if no daily calls exceed', () => {
    const { result } = renderHook(() =>
      useGetConsumerPurposeGeneralInfoAlertProps(createMockPurposeCallsWithoutExceed())
    )
    expect(result.current).toStrictEqual({
      children: 'infoApprovalMayBeRequired',
      severity: 'info',
    })
  })
})
