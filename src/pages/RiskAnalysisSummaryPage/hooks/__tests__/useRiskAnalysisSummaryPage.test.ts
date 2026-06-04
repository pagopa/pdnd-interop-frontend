import { renderHook } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useRiskAnalysisSummaryPage } from '../useRiskAnalysisSummaryPage'

const navigateMock = vi.fn()
const useQueryMock = vi.fn()

vi.mock('@/router', () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({
    purposeId: 'test-purpose-id',
  }),
}))

vi.mock('@tanstack/react-query', async () => {
  const actual =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')

  return {
    ...actual,
    useQuery: () => useQueryMock(),
    queryOptions: actual.queryOptions,
  }
})

vi.mock('../../ConsumerPurposeSummaryPage/hooks/useGetConsumerPurposeAlertProps', () => ({
  useGetConsumerPurposeAlertProps: () => undefined,
}))

describe('useRiskAnalysisSummaryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return base state correctly', () => {
    useQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useRiskAnalysisSummaryPage())

    expect(result.current.purposeId).toBe('test-purpose-id')
    expect(result.current.isLoading).toBe(false)
  })

  it('should disable publish when answer is incompatible', () => {
    useQueryMock.mockReturnValue({
      data: {
        eservice: {
          mode: 'DELIVER',
          personalData: false,
          descriptor: { state: 'ACTIVE' },
        },
        agreement: { state: 'ACTIVE' },
        riskAnalysisForm: {
          answers: {
            usesPersonalData: ['YES'],
          },
        },
        rulesetExpiration: '2099-01-01',
      },
      isLoading: false,
    })

    const { result } = renderHook(() => useRiskAnalysisSummaryPage())

    expect(result.current.isPublishButtonDisabled).toBe(true)
  })

  it('should allow publish when answer is compatible', () => {
    useQueryMock.mockReturnValue({
      data: {
        eservice: {
          mode: 'DELIVER',
          personalData: false,
          descriptor: { state: 'ACTIVE' },
        },
        agreement: { state: 'ACTIVE' },
        riskAnalysisForm: {
          answers: {
            usesPersonalData: ['NO'],
          },
        },
        rulesetExpiration: '2099-01-01',
      },
      isLoading: false,
    })

    const { result } = renderHook(() => useRiskAnalysisSummaryPage())

    expect(result.current.isPublishButtonDisabled).toBe(false)
  })

  it('should disable publish when ruleset is expired', () => {
    useQueryMock.mockReturnValue({
      data: {
        eservice: {
          mode: 'DELIVER',
          personalData: true,
          descriptor: { state: 'ACTIVE' },
        },
        agreement: { state: 'ACTIVE' },
        riskAnalysisForm: {
          answers: {
            usesPersonalData: ['YES'],
          },
        },
        rulesetExpiration: '2000-01-01',
      },
      isLoading: false,
    })

    const { result } = renderHook(() => useRiskAnalysisSummaryPage())

    expect(result.current.isPublishButtonDisabled).toBe(true)
  })

  it('should navigate on edit draft', () => {
    useQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useRiskAnalysisSummaryPage())

    result.current.handleEditDraft()

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_COMPILE', {
      params: { purposeId: 'test-purpose-id' },
    })
  })
})
