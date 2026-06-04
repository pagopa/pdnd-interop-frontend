import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import RiskAnalysisSummaryPage from '../RiskAnalysisSummary.page'
import { mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'

const mockPurposeId = 'test-purpose-id'
const navigateMock = vi.fn()

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
        rulesetExpiration: '2099-01-01',
      },
      isLoading: false,
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
