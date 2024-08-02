import { useCheckRiskAnalysisVersionMismatch } from '../useCheckRiskAnalysisVersionMismatch'
import { createMockPurpose } from '../../../__mocks__/data/purpose.mocks'
import { renderHook } from '@testing-library/react'
import type { Mock } from 'vitest'

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: vi.fn(),
  useQueries: vi.fn(),
}))

import { useQuery } from '@tanstack/react-query'

const mockUseGetRiskAnalysisLatest = (data: { version: string } | undefined) =>
  (useQuery as Mock).mockReturnValue({
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
