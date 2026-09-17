import { act, cleanup, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Purpose } from '@/api/api.generatedTypes'
import { queryClient } from '@/config/query-client'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import RiskAnalysisDetailsPage from '../RiskAnalysisDetails.page'
import type { ConcludedSigningState } from '../types'

const { getPurposeMock } = vi.hoisted(() => ({
  getPurposeMock: vi.fn<() => Promise<Purpose>>(),
}))

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (id: string) => ({
      queryKey: ['PurposeGetSingle', id],
      queryFn: getPurposeMock,
    }),
  },
}))
vi.mock('@/hooks/useMarkNotificationsAsRead', () => ({ useMarkNotificationsAsRead: vi.fn() }))

mockUseParams({ purposeId: 'purpose-id-001' })
mockUseJwt({ isReviewer: true, jwt: { uid: 'reviewer-1' } })
const navigateMock = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)

function renderPage(fromSuccess: boolean) {
  const history = createMemoryHistory({
    initialEntries: [
      { pathname: '/', state: fromSuccess ? { awaitRiskAnalysisConclusion: true } : null },
    ],
  })
  return renderWithApplicationContext(
    <RiskAnalysisDetailsPage />,
    { withRouterContext: true, withReactQueryContext: true },
    history
  )
}

describe('RiskAnalysisDetailsPage eventual consistency', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    queryClient.clear()
    getPurposeMock.mockReset()
    getPurposeMock.mockResolvedValue(
      createMockPurpose({ reviewerWorkflow: { signingState: 'SUBMITTED' } })
    )
  })

  afterEach(() => {
    cleanup()
    queryClient.clear()
    vi.useRealTimers()
  })

  it.each<ConcludedSigningState>(['SIGNED', 'REJECTED'])(
    'waits through stale responses after success until %s, then stops polling',
    async (signingState) => {
      const stalePurpose = createMockPurpose({ reviewerWorkflow: { signingState: 'SUBMITTED' } })
      getPurposeMock
        .mockResolvedValueOnce(stalePurpose)
        .mockResolvedValueOnce(stalePurpose)
        .mockResolvedValue(createMockPurpose({ reviewerWorkflow: { signingState } }))

      renderPage(true)
      await act(() => vi.advanceTimersByTimeAsync(10))
      expect(getPurposeMock).toHaveBeenCalledTimes(1)
      expect(navigateMock).not.toHaveBeenCalled()

      await act(() => vi.advanceTimersByTimeAsync(1000))
      expect(getPurposeMock).toHaveBeenCalledTimes(2)
      expect(navigateMock).not.toHaveBeenCalled()

      await act(() => vi.advanceTimersByTimeAsync(1000))
      expect(screen.getByRole('tab', { name: 'tabs.details' })).toBeInTheDocument()
      expect(navigateMock).not.toHaveBeenCalled()
      const requestsAtConclusion = getPurposeMock.mock.calls.length
      await act(() => vi.advanceTimersByTimeAsync(25000))
      expect(getPurposeMock).toHaveBeenCalledTimes(requestsAtConclusion)
      expect(navigateMock).not.toHaveBeenCalled()
    }
  )

  it('returns to the list after the bounded wait if the purpose never becomes concluded', async () => {
    renderPage(true)
    await act(() => vi.advanceTimersByTimeAsync(10))
    expect(navigateMock).not.toHaveBeenCalled()
    await act(() => vi.advanceTimersByTimeAsync(20000))
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_LIST', { replace: true })
    const requestsAtTimeout = getPurposeMock.mock.calls.length
    await act(() => vi.advanceTimersByTimeAsync(5000))
    expect(getPurposeMock).toHaveBeenCalledTimes(requestsAtTimeout)
  })

  it('redirects immediately after a non-concluded response on direct access', async () => {
    renderPage(false)
    await act(() => vi.advanceTimersByTimeAsync(10))
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_LIST', { replace: true })
    expect(getPurposeMock).toHaveBeenCalledTimes(1)
  })
})
