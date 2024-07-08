import { createMockPurpose } from '../../../../../__mocks__/data/purpose.mocks'
import { renderHook } from '@testing-library/react'
import { useGetConsumerPurposeAlertProps } from '../useGetConsumerPurposeAlertProps'

import * as hooks from '@/hooks/useCheckRiskAnalysisVersionMismatch'

const mockUseCheckRiskAnalysisVersionMismatch = (riskAnalysisVersionMismatch: boolean) =>
  vi
    .spyOn(hooks, 'useCheckRiskAnalysisVersionMismatch')
    .mockReturnValue(riskAnalysisVersionMismatch)

describe('useGetConsumerPurposeAlertProps', () => {
  it('should return undefined if the purpose is undefined', () => {
    mockUseCheckRiskAnalysisVersionMismatch(true)
    const { result } = renderHook(() => useGetConsumerPurposeAlertProps(undefined))
    expect(result.current).toBe(undefined)
  })

  it("should return a warning alert if the purpose's risk analysis version is different from the latest risk analysis", () => {
    mockUseCheckRiskAnalysisVersionMismatch(true)
    const { result } = renderHook(() => useGetConsumerPurposeAlertProps(createMockPurpose()))
    expect(result.current).toStrictEqual({
      severity: 'warning',
      children: 'newRiskAnalysisAvailable',
    })
  })

  it('should return a warning alert if the purpose agreement is archived', () => {
    mockUseCheckRiskAnalysisVersionMismatch(false)
    const { result } = renderHook(() =>
      useGetConsumerPurposeAlertProps(createMockPurpose({ agreement: { state: 'ARCHIVED' } }))
    )
    expect(result.current).toStrictEqual({
      severity: 'warning',
      children: 'descriptorOrAgreementArchived',
    })
  })

  it('should return a warning alert if the purpose e-service descriptor is archived', () => {
    mockUseCheckRiskAnalysisVersionMismatch(false)
    const { result } = renderHook(() =>
      useGetConsumerPurposeAlertProps(
        createMockPurpose({ eservice: { descriptor: { state: 'ARCHIVED' } } })
      )
    )
    expect(result.current).toStrictEqual({
      severity: 'warning',
      children: 'descriptorOrAgreementArchived',
    })
  })

  it('should return undefined if there are no alerts', () => {
    mockUseCheckRiskAnalysisVersionMismatch(false)
    const { result } = renderHook(() => useGetConsumerPurposeAlertProps(createMockPurpose()))
    expect(result.current).toBe(undefined)
  })
})
