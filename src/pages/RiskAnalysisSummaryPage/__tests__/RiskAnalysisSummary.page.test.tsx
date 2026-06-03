import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import RiskAnalysisSummaryPage from '../RiskAnalysisSummary.page'
import { mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'

import {
  checkIsRulesetExpired,
  getDaysToExpiration,
  getFormattedExpirationDate,
} from '@/utils/purpose.utils'

import {
  createMockPurposeUsesPersonalDataAnswerYes,
  createMockPurposeUsesPersonalDataAnswerNo,
  createMockPurposeCompatiblePersonalDataYes,
  createMockPurposeCompatiblePersonalDataNo,
} from '@/../__mocks__/data/purpose.mocks'

const mockPurposeId = 'test-purpose-id'

mockUseParams({
  purposeId: mockPurposeId,
})

const navigateMock = vi.fn()

vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)

vi.mock('@/pages/ConsumerPurposeSummaryPage/components', () => ({
  ConsumerPurposeSummaryGeneralInformationAccordion: () => (
    <div data-testid="general-info-accordion" />
  ),
  ConsumerPurposeSummaryRiskAnalysisAccordion: () => <div data-testid="risk-analysis-accordion" />,
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

vi.mock('@/pages/ConsumerPurposeSummaryPage/hooks/useGetConsumerPurposeAlertProps', () => ({
  useGetConsumerPurposeAlertProps: () => undefined,
}))

vi.mock('@/utils/purpose.utils', async () => {
  const actual = await vi.importActual('@/utils/purpose.utils')

  return {
    ...(actual as Record<string, unknown>),
    checkIsRulesetExpired: vi.fn(),
    getDaysToExpiration: vi.fn(),
    getFormattedExpirationDate: vi.fn(),
  }
})

describe('RiskAnalysisSummaryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(checkIsRulesetExpired).mockReturnValue(false)
    vi.mocked(getDaysToExpiration).mockReturnValue(10)
    vi.mocked(getFormattedExpirationDate).mockReturnValue('01/01/2030')
  })

  it('should render page title', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeUsesPersonalDataAnswerYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('riskAnalysisSummary.title')).toBeInTheDocument()
  })

  it('should disable approve button when personal data answer is incompatible (NO / true)', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeUsesPersonalDataAnswerNo(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByRole('button', {
        name: 'riskAnalysisSummary.approveBtn',
      })
    ).toBeDisabled()
  })

  it('should disable approve button when personal data answer is incompatible (YES / false)', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeUsesPersonalDataAnswerYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByRole('button', {
        name: 'riskAnalysisSummary.approveBtn',
      })
    ).toBeDisabled()
  })

  it('should enable approve button when personal data answer is compatible (YES / true)', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeCompatiblePersonalDataYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByRole('button', {
        name: 'riskAnalysisSummary.approveBtn',
      })
    ).toBeEnabled()
  })

  it('should enable approve button when personal data answer is compatible (NO / false)', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeCompatiblePersonalDataNo(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByRole('button', {
        name: 'riskAnalysisSummary.approveBtn',
      })
    ).toBeEnabled()
  })

  it('should show info alert', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeCompatiblePersonalDataYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('riskAnalysisSummary.infoAlert')).toBeInTheDocument()
  })

  it('should show ruleset expiration alert', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeUsesPersonalDataAnswerYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('summary.alerts.infoRulesetExpiration')).toBeInTheDocument()
  })

  it('should show expired ruleset alert', () => {
    vi.mocked(checkIsRulesetExpired).mockReturnValue(true)

    vi.mocked(getDaysToExpiration).mockReturnValue(undefined)

    vi.mocked(getFormattedExpirationDate).mockReturnValue(undefined)

    useQueryMock.mockReturnValue({
      data: createMockPurposeUsesPersonalDataAnswerYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('summary.alerts.rulesetExpired.label')).toBeInTheDocument()
  })

  it('should navigate to compile page when edit button is clicked', async () => {
    const user = userEvent.setup()

    useQueryMock.mockReturnValue({
      data: createMockPurposeCompatiblePersonalDataYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(
      screen.getByRole('button', {
        name: 'editDraft',
      })
    )

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_RISK_ANALYSIS_COMPILE', {
      params: {
        purposeId: mockPurposeId,
      },
    })
  })

  it('should disable edit and approve buttons when agreement is archived', () => {
    useQueryMock.mockReturnValue({
      data: {
        ...createMockPurposeCompatiblePersonalDataYes(),
        agreement: {
          state: 'ARCHIVED',
        },
      },
      isLoading: false,
    })

    renderWithApplicationContext(<RiskAnalysisSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('button', { name: 'editDraft' })).toBeDisabled()

    expect(
      screen.getByRole('button', {
        name: 'riskAnalysisSummary.approveBtn',
      })
    ).toBeDisabled()
  })
})
