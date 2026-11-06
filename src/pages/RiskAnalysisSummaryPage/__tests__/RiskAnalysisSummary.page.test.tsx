import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import RiskAnalysisSummaryPage from '../RiskAnalysisSummary.page'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import type { RiskAnalysisSigningState } from '@/api/api.generatedTypes'

const mockPurposeId = 'test-purpose-id'
const navigateMock = vi.fn()

type MockedPurposeData = {
  eservice: {
    mode: string
    personalData: boolean
    descriptor: { state: string }
  }
  agreement: { state: string }
  riskAnalysisForm: {
    answers: {
      usesPersonalData: string[]
    }
  }
  rulesetExpiration: string
  reviewerWorkflow?: {
    signingState?: RiskAnalysisSigningState
    reviewers: Array<{ userId: string }>
  }
}

const basePurposeData: MockedPurposeData = {
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
  rulesetExpiration: '2099-01-01',
}

let mockedPurposeData: MockedPurposeData = basePurposeData
let isPurposeLoading = false
let isPurposeFetching = false

const { markNotificationsAsReadMock } = vi.hoisted(() => ({
  markNotificationsAsReadMock: vi.fn(),
}))

vi.mock('@/api/notification/notification.services', () => ({
  NotificationServices: {
    markNotificationsAsReadByEntityId: markNotificationsAsReadMock,
  },
}))

mockUseParams({
  purposeId: mockPurposeId,
})

vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (id: string) => ['purpose', id],
  },
}))

vi.mock('@tanstack/react-query', async () => {
  const actual =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')

  return {
    ...actual,
    useQuery: () => ({
      data: mockedPurposeData,
      isLoading: isPurposeLoading,
      isFetching: isPurposeFetching,
    }),
  }
})

vi.mock('@/pages/ConsumerPurposeSummaryPage/hooks/useGetConsumerPurposeAlertProps', () => ({
  useGetConsumerPurposeAlertProps: () => undefined,
}))

vi.mock('@/pages/ConsumerPurposeSummaryPage/components', () => ({
  ConsumerPurposeSummaryGeneralInformationAccordion: () => (
    <div data-testid="general-info-accordion" />
  ),
  ConsumerPurposeSummaryRiskAnalysisAccordion: () => <div data-testid="risk-analysis-accordion" />,
}))

const mockRouteKey = (routeKey: string) => {
  vi.spyOn(router, 'useCurrentRoute').mockReturnValue({
    routeKey,
  } as never)
}

describe('RiskAnalysisSummaryPage (UI)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRouteKey('SUBSCRIBE_RISK_ANALYSIS_SUMMARY')
    mockUseJwt({ isAdmin: false, isReviewer: true, jwt: { uid: 'reviewer-1' } })
    mockedPurposeData = basePurposeData
    isPurposeLoading = false
    isPurposeFetching = false
  })

  it('should mark notifications as read when the assigned reviewer opens the submitted analysis', async () => {
    mockRouteKey('SUBSCRIBE_RISK_ANALYSIS_APPROVAL')
    mockedPurposeData = {
      ...basePurposeData,
      reviewerWorkflow: { signingState: 'SUBMITTED', reviewers: [{ userId: 'reviewer-1' }] },
    }

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await waitFor(() => {
      expect(markNotificationsAsReadMock).toHaveBeenCalledWith({ entityId: mockPurposeId })
    })
  })

  it('should mark notifications for the route entity regardless of reviewer assignment', async () => {
    mockRouteKey('SUBSCRIBE_RISK_ANALYSIS_APPROVAL')
    mockedPurposeData = {
      ...basePurposeData,
      reviewerWorkflow: { signingState: 'SUBMITTED', reviewers: [{ userId: 'reviewer-2' }] },
    }

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await waitFor(() => {
      expect(markNotificationsAsReadMock).toHaveBeenCalledWith({ entityId: mockPurposeId })
    })
  })

  it('should mark notifications for the route entity while the purpose is loading', async () => {
    mockRouteKey('SUBSCRIBE_RISK_ANALYSIS_APPROVAL')
    isPurposeLoading = true
    mockedPurposeData = {
      ...basePurposeData,
      reviewerWorkflow: { signingState: 'SUBMITTED', reviewers: [{ userId: 'reviewer-1' }] },
    }

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await waitFor(() => {
      expect(markNotificationsAsReadMock).toHaveBeenCalledWith({ entityId: mockPurposeId })
    })
  })

  it.each(['SUBSCRIBE_RISK_ANALYSIS_APPROVAL', 'SUBSCRIBE_RISK_ANALYSIS_SUMMARY'])(
    'should redirect the assigned reviewer from %s to signed details without approval controls',
    (routeKey) => {
      mockRouteKey(routeKey)
      mockedPurposeData = {
        ...basePurposeData,
        reviewerWorkflow: { signingState: 'SIGNED', reviewers: [{ userId: 'reviewer-1' }] },
      }

      renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
        withReactQueryContext: true,
        withRouterContext: true,
      })

      expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_DETAILS', {
        params: { purposeId: mockPurposeId },
        replace: true,
      })
      expect(screen.queryByRole('button', { name: 'approveBtn' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'rejectBtn' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'editDraft' })).not.toBeInTheDocument()
    }
  )

  it('should wait for the signed state refetch before redirecting', () => {
    mockRouteKey('SUBSCRIBE_RISK_ANALYSIS_APPROVAL')
    isPurposeFetching = true
    mockedPurposeData = {
      ...basePurposeData,
      reviewerWorkflow: { signingState: 'SIGNED', reviewers: [{ userId: 'reviewer-1' }] },
    }

    const { rerender } = renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(navigateMock).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'approveBtn' })).not.toBeInTheDocument()

    isPurposeFetching = false
    rerender(<RiskAnalysisSummaryPage />)

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_DETAILS', {
      params: { purposeId: mockPurposeId },
      replace: true,
    })
  })

  it('should keep the summary flow for an admin who is not an assigned reviewer', () => {
    mockUseJwt()
    mockedPurposeData = {
      ...basePurposeData,
      reviewerWorkflow: { signingState: 'SIGNED', reviewers: [{ userId: 'reviewer-1' }] },
    }

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(navigateMock).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'editDraft' })).toBeInTheDocument()
  })

  it.each([
    { routeKey: 'SUBSCRIBE_RISK_ANALYSIS_APPROVAL', expanded: 'true' },
    { routeKey: 'SUBSCRIBE_RISK_ANALYSIS_SUMMARY', expanded: 'false' },
  ])('should start card 2 with aria-expanded=$expanded for $routeKey', ({ routeKey, expanded }) => {
    mockRouteKey(routeKey)

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('button', { name: '2 riskAnalysisSection.title' })).toHaveAttribute(
      'aria-expanded',
      expanded
    )
  })

  it('should render summary page title', () => {
    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('titleSummary')).toBeInTheDocument()
  })

  it('should render approval page title', () => {
    mockRouteKey('SUBSCRIBE_RISK_ANALYSIS_APPROVAL')

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('titleApproval')).toBeInTheDocument()
  })

  it('should render main sections', () => {
    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('general-info-accordion')).toBeInTheDocument()
    expect(screen.getByTestId('risk-analysis-accordion')).toBeInTheDocument()
    expect(screen.getByText('infoAlert')).toBeInTheDocument()
  })

  it('should render multiple-reviewer info alert when reviewers are more than one', () => {
    mockedPurposeData = {
      ...basePurposeData,
      reviewerWorkflow: {
        reviewers: [{ userId: 'reviewer-1' }, { userId: 'reviewer-2' }],
      },
    }

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('infoAlertMoreReviewers')).toBeInTheDocument()
  })

  it('should render only standard info alert when exactly one reviewer is assigned', () => {
    mockedPurposeData = {
      ...basePurposeData,
      reviewerWorkflow: {
        reviewers: [{ userId: 'reviewer-1' }],
      },
    }

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('infoAlert')).toBeInTheDocument()
    expect(screen.queryByText('infoAlertMoreReviewers')).not.toBeInTheDocument()
  })

  it('should render edit and approve buttons in summary flow', () => {
    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('button', { name: 'editDraft' })).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'approveBtn',
      })
    ).toBeInTheDocument()
  })

  it('should render reject and approve buttons in approval flow', () => {
    mockRouteKey('SUBSCRIBE_RISK_ANALYSIS_APPROVAL')

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByRole('button', {
        name: 'rejectBtn',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'approveBtn',
      })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', {
        name: 'editDraft',
      })
    ).not.toBeInTheDocument()
  })

  it('should navigate to compile page when edit button is clicked', async () => {
    const user = userEvent.setup()

    mockRouteKey('SUBSCRIBE_RISK_ANALYSIS_SUMMARY')

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'editDraft' }))

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_COMPILE', {
      params: {
        purposeId: mockPurposeId,
      },
    })
  })
})
