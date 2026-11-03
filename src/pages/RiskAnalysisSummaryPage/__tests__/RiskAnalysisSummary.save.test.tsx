import { act, cleanup, fireEvent, screen } from '@testing-library/react'
import { PurposeServices } from '@/api/purpose'
import {
  createMockPurpose,
  createMockRiskAnalysisFormConfig,
} from '@/../__mocks__/data/purpose.mocks'
import { queryClient } from '@/config/query-client'
import { useDialogStore, useToastNotificationStore } from '@/stores'
import * as router from '@/router'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  mockUseParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import RiskAnalysisSummaryPage from '../RiskAnalysisSummary.page'
import { useRiskAnalysisReviewStore } from '../riskAnalysisReview.store'

vi.mock('@/hooks/useMarkNotificationsAsRead', () => ({ useMarkNotificationsAsRead: vi.fn() }))

const stalePurpose = {
  ...createMockPurpose({ currentVersion: { state: 'DRAFT' } }),
  metadataVersion: 3,
  riskAnalysisForm: { version: '2.0', answers: { institutionalPurpose: ['Previous answer'] } },
}
const savedPurpose = {
  ...stalePurpose,
  metadataVersion: 7,
  riskAnalysisForm: { version: '2.0', answers: { institutionalPurpose: ['Saved answer'] } },
}
const navigate = vi.fn()

function renderPage() {
  return renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  queryClient.clear()
  vi.clearAllMocks()
  mockUseParams({ purposeId: stalePurpose.id })
  mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_RISK_ANALYSIS_APPROVAL' })
  mockUseJwt({ isAdmin: false, isReviewer: true })
  vi.spyOn(router, 'useNavigate').mockReturnValue(navigate)
  vi.spyOn(PurposeServices, 'getSingle').mockResolvedValue(stalePurpose)
  vi.spyOn(PurposeServices, 'getRiskAnalysisVersion').mockResolvedValue(
    createMockRiskAnalysisFormConfig()
  )
  useRiskAnalysisReviewStore.getState().setPendingReview({
    purposeId: stalePurpose.id,
    previousMetadataVersion: 3,
    riskAnalysisForm: savedPurpose.riskAnalysisForm,
  })
  queryClient.setQueryData(['PurposeGetSingle', stalePurpose.id], stalePurpose)
})

afterEach(() => {
  cleanup()
  queryClient.clear()
  useRiskAnalysisReviewStore.getState().setPendingReview(undefined)
  useDialogStore.getState().closeDialog()
  useToastNotificationStore.getState().hideToast()
  vi.useRealTimers()
})

describe('starting a review after saving the risk analysis', () => {
  it('cancels the pending wait when leaving the summary before convergence', async () => {
    const page = renderPage()
    await act(() => vi.advanceTimersByTimeAsync(10))
    page.unmount()

    await act(() => vi.advanceTimersByTimeAsync(25_000))

    expect(navigate).not.toHaveBeenCalled()
    expect(useToastNotificationStore.getState().isShown).toBe(false)
  })

  it('redirects from the live signed state even when the saved form has not converged', async () => {
    vi.mocked(PurposeServices.getSingle).mockResolvedValue({
      ...stalePurpose,
      metadataVersion: 8,
      reviewerWorkflow: {
        signingState: 'SIGNED',
        reviewers: [{ userId: 'uid', name: 'Reviewer', familyName: 'A' }],
      },
    })
    renderPage()
    await act(() => vi.advanceTimersByTimeAsync(10))

    expect(navigate).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_DETAILS', {
      params: { purposeId: stalePurpose.id },
      replace: true,
    })
    expect(screen.queryByRole('button', { name: 'approveBtn' })).not.toBeInTheDocument()
  })

  it('waits through the old cache and stale readmodel, then reviews the matching saved content and version', async () => {
    const getPurpose = vi.mocked(PurposeServices.getSingle)
    getPurpose.mockResolvedValueOnce(stalePurpose).mockResolvedValue(savedPurpose)
    renderPage()
    await act(() => vi.advanceTimersByTimeAsync(10))

    expect(screen.queryByText('Previous answer')).not.toBeInTheDocument()
    expect(screen.queryByText('Saved answer')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'approveBtn' })).toBeDisabled()
    expect(getPurpose).toHaveBeenCalledTimes(1)

    await act(() => vi.advanceTimersByTimeAsync(1000))
    await act(() => vi.advanceTimersByTimeAsync(10))
    expect(screen.getByText('Saved answer')).toBeVisible()
    expect(screen.getByRole('button', { name: 'approveBtn' })).toBeEnabled()
    expect(useRiskAnalysisReviewStore.getState().pendingReview).toBeUndefined()

    fireEvent.click(screen.getByRole('button', { name: 'approveBtn' }))
    expect(useDialogStore.getState().dialog).toMatchObject({ metadataVersionToSign: 7 })
    const requestsAtReview = getPurpose.mock.calls.length
    await act(() => vi.advanceTimersByTimeAsync(5000))
    expect(getPurpose).toHaveBeenCalledTimes(requestsAtReview)
  })

  it('waits for metadata advancement even when saving unchanged answers', async () => {
    useRiskAnalysisReviewStore.getState().setPendingReview({
      purposeId: stalePurpose.id,
      previousMetadataVersion: 3,
      riskAnalysisForm: stalePurpose.riskAnalysisForm,
    })
    vi.mocked(PurposeServices.getSingle)
      .mockResolvedValueOnce(stalePurpose)
      .mockResolvedValue({ ...stalePurpose, metadataVersion: 5 })
    renderPage()
    await act(() => vi.advanceTimersByTimeAsync(10))
    expect(screen.queryByText('Previous answer')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'approveBtn' })).toBeDisabled()

    await act(() => vi.advanceTimersByTimeAsync(1000))
    await act(() => vi.advanceTimersByTimeAsync(10))
    expect(screen.getByText('Previous answer')).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'approveBtn' }))
    expect(useDialogStore.getState().dialog).toMatchObject({ metadataVersionToSign: 5 })
  })

  it.each(['timeout', 'different answers', 'different form version', 'missing previous metadata'])(
    'does not approve an unverified post-save baseline: %s',
    async (reason) => {
      if (reason === 'different answers') {
        vi.mocked(PurposeServices.getSingle).mockResolvedValue({
          ...stalePurpose,
          metadataVersion: 7,
        })
      }
      if (reason === 'different form version') {
        vi.mocked(PurposeServices.getSingle).mockResolvedValue({
          ...savedPurpose,
          riskAnalysisForm: { ...savedPurpose.riskAnalysisForm, version: '2.1' },
        })
      }
      if (reason === 'missing previous metadata') {
        useRiskAnalysisReviewStore.getState().setPendingReview({
          purposeId: stalePurpose.id,
          previousMetadataVersion: undefined,
          riskAnalysisForm: savedPurpose.riskAnalysisForm,
        })
        vi.mocked(PurposeServices.getSingle).mockResolvedValue(savedPurpose)
      }
      const page = renderPage()
      await act(() => vi.advanceTimersByTimeAsync(20_010))

      expect(navigate).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_LIST', { replace: true })
      expect(screen.getByText('error')).toBeVisible()
      expect(screen.getByRole('button', { name: 'approveBtn' })).toBeDisabled()
      fireEvent.click(screen.getByRole('button', { name: 'approveBtn' }))
      expect(useDialogStore.getState().dialog).toBeNull()
      expect(useRiskAnalysisReviewStore.getState().pendingReview).toBeUndefined()

      page.unmount()
      queryClient.clear()
      vi.mocked(PurposeServices.getSingle).mockResolvedValue(savedPurpose)
      renderPage()
      await act(() => vi.advanceTimersByTimeAsync(10))
      await act(() => vi.advanceTimersByTimeAsync(10))
      expect(screen.getByText('Saved answer')).toBeVisible()
      expect(screen.getByRole('button', { name: 'approveBtn' })).toBeEnabled()
    }
  )
})
