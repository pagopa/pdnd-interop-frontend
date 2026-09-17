import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RiskAnalysisDetailsPage from '../RiskAnalysisDetails.page'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type { Purpose, RiskAnalysisSigningState } from '@/api/api.generatedTypes'

const { markNotificationsAsReadMock, activeTabMock } = vi.hoisted(() => ({
  markNotificationsAsReadMock: vi.fn(),
  activeTabMock: vi.fn(),
}))

mockUseParams({ purposeId: 'purpose-id-001' })

mockUseJwt({ isAdmin: false, isReviewer: true, jwt: { uid: 'reviewer-1' } })

const mockNavigate = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate)

vi.mock('@/hooks/useMarkNotificationsAsRead', () => ({
  useMarkNotificationsAsRead: (entityId: string | undefined) =>
    markNotificationsAsReadMock(entityId),
}))

vi.mock('@/hooks/useActiveTab', () => ({
  useActiveTab: () => activeTabMock(),
}))

vi.mock('@/components/shared/RiskAnalysisInfoSummary', () => ({
  PurposeRiskAnalysisInfoSummary: () => <div data-testid="risk-analysis-info-summary" />,
}))

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (id: string) => ['purpose', id],
  },
}))

const useQueryMock = vi.fn()

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()

  return {
    ...actual,
    useQuery: () => useQueryMock(),
  }
})

function createConcludedPurpose(
  signingState: RiskAnalysisSigningState,
  overwrites: Partial<Purpose['reviewerWorkflow']> = {}
): Purpose {
  return {
    ...createMockPurpose(),
    reviewerWorkflow: {
      signingState,
      reviewers: [
        {
          userId: 'reviewer-1',
          name: 'Mario',
          familyName: 'Rossi',
          sentToReviewerAt: '2026-03-10T10:00:00.000Z',
        },
      ],
      ...overwrites,
    },
  }
}

function renderPage(purpose: Purpose | undefined, { isLoading = false, isFetching = false } = {}) {
  useQueryMock.mockReturnValue({ data: purpose, isLoading, isFetching })

  return renderWithApplicationContext(<RiskAnalysisDetailsPage />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('RiskAnalysisDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    activeTabMock.mockReturnValue({ activeTab: 'details', updateActiveTab: vi.fn() })
  })

  it('should render the purpose title and the info alert for an approved risk analysis', () => {
    const purpose = createConcludedPurpose('SIGNED', {
      signedBy: 'reviewer-1',
      signedAt: '2026-03-12T10:00:00.000Z',
    })

    renderPage(purpose)

    expect(screen.getByRole('heading', { name: purpose.title })).toBeInTheDocument()
    expect(screen.getByText('signedAlert')).toBeInTheDocument()
    expect(screen.queryByText('rejectedAlert.label')).not.toBeInTheDocument()
  })

  it('should render the rejected alert and open the rejection drawer', async () => {
    const user = userEvent.setup()

    renderPage(
      createConcludedPurpose('REJECTED', {
        rejectedBy: 'reviewer-1',
        rejectionReason: 'Motivazione del rifiuto',
      })
    )

    expect(screen.getByText('rejectedAlert.label')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'rejectedAlert.action' }))

    expect(screen.getByText('Motivazione del rifiuto')).toBeInTheDocument()
  })

  it('should render both tabs and the purpose sections in the details tab', () => {
    renderPage(createConcludedPurpose('SIGNED', { signedBy: 'reviewer-1' }))

    expect(screen.getByRole('tab', { name: 'tabs.details' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'tabs.riskAnalysis' })).toBeInTheDocument()

    expect(screen.getByText('generalInfoSection.label')).toBeInTheDocument()
    expect(screen.getByText('loadEstimationSection.label')).toBeInTheDocument()
    expect(screen.getByText('assignmentSection.title')).toBeInTheDocument()
  })

  it('should render the risk analysis summary in the risk analysis tab', () => {
    activeTabMock.mockReturnValue({ activeTab: 'riskAnalysis', updateActiveTab: vi.fn() })

    renderPage(createConcludedPurpose('SIGNED', { signedBy: 'reviewer-1' }))

    expect(screen.getByText('riskAnalysisSection.title')).toBeInTheDocument()
    expect(screen.getByText('personalDataFlag.label')).toBeInTheDocument()
    expect(screen.getByTestId('risk-analysis-info-summary')).toBeInTheDocument()
  })

  it('should not render the section subtitle in the risk analysis tab when rejected', () => {
    activeTabMock.mockReturnValue({ activeTab: 'riskAnalysis', updateActiveTab: vi.fn() })

    renderPage(createConcludedPurpose('REJECTED', { rejectionReason: 'reason' }))

    expect(screen.getByText('riskAnalysisSection.title')).toBeInTheDocument()
    expect(screen.queryByText('riskAnalysisSection.signedSubtitle')).not.toBeInTheDocument()
  })

  it('should mark the purpose notifications as read', () => {
    renderPage(createConcludedPurpose('SIGNED', { signedBy: 'reviewer-1' }))

    expect(markNotificationsAsReadMock).toHaveBeenCalledWith('purpose-id-001')
  })

  it('should redirect to the list when the risk analysis is not concluded', () => {
    renderPage(createConcludedPurpose('ASSIGNED'))

    expect(mockNavigate).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_LIST', { replace: true })
    expect(screen.queryByRole('tab', { name: 'tabs.details' })).not.toBeInTheDocument()
  })

  it('should not redirect while the purpose is still loading', () => {
    renderPage(undefined, { isLoading: true, isFetching: true })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should not redirect on a stale cached state while the query is refetching', () => {
    renderPage(createConcludedPurpose('SUBMITTED'), { isFetching: true })

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
