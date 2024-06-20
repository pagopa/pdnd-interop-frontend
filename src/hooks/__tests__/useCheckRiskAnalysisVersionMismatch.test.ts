import { PurposeQueries } from '@/api/purpose'
import { useCheckRiskAnalysisVersionMismatch } from '../useCheckRiskAnalysisVersionMismatch'
import { createMockPurpose } from '../../../__mocks__/data/purpose.mocks'
import { renderHook } from '@testing-library/react'

const mockUseGetRiskAnalysisLatest = (data: { version: string } | undefined) =>
  vi.spyOn(PurposeQueries, 'useGetRiskAnalysisLatest').mockReturnValue({
    data,
  } as never)

describe('useCheckRiskAnalysisVersionMismatch', () => {
  it('should return false if the purpose is undefined', () => {
    mockUseGetRiskAnalysisLatest({ version: '1' })
    const { result } = renderHook(() =>
      useCheckRiskAnalysisVersionMismatch(createMockPurpose({ riskAnalysisForm: undefined }))
    )
    expect(result.current).toBe(false)
  })

  it('should return false if the latest risk analysis is not yet loaded', () => {
    mockUseGetRiskAnalysisLatest(undefined)
    const { result } = renderHook(() =>
      useCheckRiskAnalysisVersionMismatch(createMockPurpose({ riskAnalysisForm: undefined }))
    )
    expect(result.current).toBe(false)
  })

  it("should return false if the purpose's risk analysis is not yet created", () => {
    mockUseGetRiskAnalysisLatest({ version: '1' })
    const { result } = renderHook(() =>
      useCheckRiskAnalysisVersionMismatch(createMockPurpose({ riskAnalysisForm: undefined }))
    )
    expect(result.current).toBe(false)
  })

  it("should return false if the purpose's risk analysis version is equal to the latest risk analysis", () => {
    mockUseGetRiskAnalysisLatest({ version: '1' })
    const { result } = renderHook(() =>
      useCheckRiskAnalysisVersionMismatch(createMockPurpose({ riskAnalysisForm: { version: '1' } }))
    )
    expect(result.current).toBe(false)
  })

  it("should return true if the purpose's risk analysis version is different from the latest risk analysis", () => {
    mockUseGetRiskAnalysisLatest({ version: '2' })
    const { result } = renderHook(() =>
      useCheckRiskAnalysisVersionMismatch(createMockPurpose({ riskAnalysisForm: { version: '1' } }))
    )
    expect(result.current).toBe(true)
  })
})
