import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import ConsumerPurposeSummaryPage from '../ConsumerPurposeSummary.page'
import { mockUseJwt, mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
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
  createMockPurposeCallsPerConsumerExceed,
  createMockPurposeCallsTotalExceed,
} from '@/../__mocks__/data/purpose.mocks'

const mockPurposeId = 'test-purpose-id'
mockUseParams({ purposeId: mockPurposeId })

const mockFn = vi.fn()

vi.spyOn(router, 'useNavigate').mockReturnValue(mockFn)

vi.mock('../components', () => ({
  ConsumerPurposeSummaryGeneralInformationAccordion: () => (
    <div data-testid="general-info-accordion" />
  ),
  ConsumerPurposeSummaryRiskAnalysisAccordion: () => <div data-testid="risk-analysis-accordion" />,
}))

mockUseJwt()

const deleteDraftMock = vi.fn()
const publishDraftMock = vi.fn()

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (id: string) => ['purpose', id],
  },
  PurposeMutations: {
    useDeleteDraft: () => ({
      mutate: deleteDraftMock,
    }),
    useActivateVersion: () => ({
      mutate: publishDraftMock,
    }),
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

vi.mock('./hooks/useGetConsumerPurposeAlertProps', () => ({
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

describe('ConsumerPurposeSummaryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkIsRulesetExpired).mockReturnValue(false)
    vi.mocked(getDaysToExpiration).mockReturnValue(10)
    vi.mocked(getFormattedExpirationDate).mockReturnValue('01/01/2030')
  })

  it('renders page title', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeUsesPersonalDataAnswerYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('summary.title')).toBeInTheDocument()
  })

  it('disables publish button when personal data answer is incompatible (case: user answer NO, eservice personalData true)', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeUsesPersonalDataAnswerNo(),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', {
      name: 'publish',
    })

    expect(publishButton).toBeDisabled()
  })

  it('disables publish button when personal data answer is incompatible (case: user answer YES, eservice personalData false)', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeUsesPersonalDataAnswerYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', {
      name: 'publish',
    })

    expect(publishButton).toBeDisabled()
  })

  it('enables publish button when personal data answer is compatible (case: user answer YES, eservice personalData true)', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeCompatiblePersonalDataYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', {
      name: 'publish',
    })

    expect(publishButton).toBeEnabled()
  })

  it('enables publish button when personal data answer is compatible (case: user answer NO, eservice personalData false)', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeCompatiblePersonalDataNo(),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', {
      name: 'publish',
    })

    expect(publishButton).toBeEnabled()
  })

  it('shows info alert when there is an expiration date to show', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeUsesPersonalDataAnswerYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('summary.alerts.infoRulesetExpiration')).toBeInTheDocument()
  })

  it('does not show alert when there is no expiration date to show', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeUsesPersonalDataAnswerNo(),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByText('summary.alerts.infoRulesetExpiration')).not.toBeInTheDocument()
  })
  it('shows alert if isRulesetExpired is true', () => {
    vi.mocked(checkIsRulesetExpired).mockReturnValue(true)
    vi.mocked(getDaysToExpiration).mockReturnValue(undefined)
    vi.mocked(getFormattedExpirationDate).mockReturnValue(undefined)

    useQueryMock.mockReturnValue({
      data: createMockPurposeUsesPersonalDataAnswerYes(),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('summary.alerts.rulesetExpired.label')).toBeInTheDocument()
  })
  it('shows info alert when daily calls exceed calls per consumer', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeCallsPerConsumerExceed(),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('summary.alerts.infoDailyCallsPerConsumerExceed')).toBeInTheDocument()
  })
  it('shows info alert when daily calls exceed total calls', () => {
    useQueryMock.mockReturnValue({
      data: createMockPurposeCallsTotalExceed(),
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    console.log('----------------')
    screen.debug(undefined, 1000000)
    console.log('----------------')

    expect(screen.getByText('summary.alerts.infoDailyCallsTotalExceed')).toBeInTheDocument()
  })
})
