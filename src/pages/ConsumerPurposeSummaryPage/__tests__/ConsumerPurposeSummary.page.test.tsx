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
} from '@/../__mocks__/data/purpose.mocks'
import type { ReviewerWorkflow, RiskAnalysisSigningState } from '@/api/api.generatedTypes'

const mockPurposeId = 'test-purpose-id'
mockUseParams({ purposeId: mockPurposeId })

const mockFn = vi.fn()

vi.spyOn(router, 'useNavigate').mockReturnValue(mockFn)

// Stub the accordions (data-bound, suspense) but keep the real rejected alert so its
// content and "read reason" action can be asserted. We import only the rejected alert
// file (light: MUI + i18n) instead of the whole barrel, whose accordions pull in
// `@/router` and would create a huge/circular import graph that hangs the test.
vi.mock('../components', async () => {
  const { ConsumerPurposeSummaryRiskAnalysisRejectedAlert } = await vi.importActual<
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    typeof import('../components/ConsumerPurposeSummaryRiskAnalysisRejectedAlert')
  >('../components/ConsumerPurposeSummaryRiskAnalysisRejectedAlert')
  return {
    ConsumerPurposeSummaryGeneralInformationAccordion: () => (
      <div data-testid="general-info-accordion" />
    ),
    ConsumerPurposeSummaryAssignmentAccordion: () => <div data-testid="assignment-accordion" />,
    ConsumerPurposeSummaryRiskAnalysisAccordion: () => (
      <div data-testid="risk-analysis-accordion" />
    ),
    ConsumerPurposeSummaryRiskAnalysisRejectedAlert,
  }
})

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
      name: 'summary.publishBtn',
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
      name: 'summary.publishBtn',
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
      name: 'summary.publishBtn',
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
      name: 'summary.publishBtn',
    })

    expect(publishButton).toBeEnabled()
  })

  it('disables publish button when risk analysis is not compiled (DELIVER mode, self-compile assignment)', () => {
    useQueryMock.mockReturnValue({
      data: { ...createMockPurposeCompatiblePersonalDataYes(), riskAnalysisForm: undefined },
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', {
      name: 'summary.publishBtn',
    })

    expect(publishButton).toBeDisabled()
  })

  it('enables publish button when risk analysis is not compiled but eservice is in RECEIVE mode (provider-supplied)', () => {
    const purpose = createMockPurposeCompatiblePersonalDataYes()
    useQueryMock.mockReturnValue({
      data: {
        ...purpose,
        riskAnalysisForm: undefined,
        eservice: { ...purpose.eservice, mode: 'RECEIVE' },
      },
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const publishButton = screen.getByRole('button', {
      name: 'summary.publishBtn',
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

  describe('risk analysis review status (options 2 / 3)', () => {
    const renderWithReviewerWorkflow = (signingState: RiskAnalysisSigningState | undefined) => {
      const reviewerWorkflow: ReviewerWorkflow | undefined = signingState
        ? {
            reviewMode:
              signingState === 'ASSIGNED'
                ? 'REVIEWER_WRITES_REVIEWER_SIGNS'
                : 'ADMIN_WRITES_REVIEWER_SIGNS',
            reviewerIds: ['11111111-2222-3333-4444-555555555555'],
            signingState,
          }
        : undefined

      useQueryMock.mockReturnValue({
        data: { ...createMockPurposeCompatiblePersonalDataYes(), reviewerWorkflow },
        isLoading: false,
      })

      renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
        withReactQueryContext: true,
        withRouterContext: true,
      })
    }

    const getPublishButton = () => screen.getByRole('button', { name: 'summary.publishBtn' })

    it('option 1 (no reviewerWorkflow): no chip, no info alert, publish enabled', () => {
      renderWithReviewerWorkflow(undefined)

      expect(screen.queryByText('chip.awaitingApproval')).not.toBeInTheDocument()
      expect(screen.queryByText('chip.awaitingCompilation')).not.toBeInTheDocument()
      expect(screen.queryByText('infoAlert.adminWritesReviewerSigns')).not.toBeInTheDocument()
      expect(screen.queryByText('infoAlert.reviewerWritesReviewerSigns')).not.toBeInTheDocument()
      expect(getPublishButton()).toBeEnabled()
    })

    it('DRAFT (approval to request): error chip, no info alert, publish disabled', () => {
      renderWithReviewerWorkflow('DRAFT')

      expect(screen.getByText('chip.approvalToRequest')).toBeInTheDocument()
      expect(screen.queryByText('infoAlert.adminWritesReviewerSigns')).not.toBeInTheDocument()
      expect(screen.queryByText('infoAlert.reviewerWritesReviewerSigns')).not.toBeInTheDocument()
      expect(getPublishButton()).toBeDisabled()
    })

    it('SUBMITTED (option 2, awaiting approval): warning chip, info alert, publish disabled, body shown', () => {
      renderWithReviewerWorkflow('SUBMITTED')

      expect(screen.getByText('chip.awaitingApproval')).toBeInTheDocument()
      expect(screen.getByText('infoAlert.adminWritesReviewerSigns')).toBeInTheDocument()
      expect(screen.getByTestId('risk-analysis-accordion')).toBeInTheDocument()
      expect(getPublishButton()).toBeDisabled()
    })

    it('ASSIGNED (option 3, awaiting compilation): warning chip, info alert, publish disabled, body hidden', () => {
      renderWithReviewerWorkflow('ASSIGNED')

      expect(screen.getByText('chip.awaitingCompilation')).toBeInTheDocument()
      expect(screen.getByText('infoAlert.reviewerWritesReviewerSigns')).toBeInTheDocument()
      // Awaiting compilation → accordion body is hidden (no answers section rendered).
      expect(screen.queryByTestId('risk-analysis-accordion')).not.toBeInTheDocument()
      expect(getPublishButton()).toBeDisabled()
    })

    it('SIGNED (approved): success chip, no info alert, publish enabled', () => {
      renderWithReviewerWorkflow('SIGNED')

      expect(screen.getByText('chip.approved')).toBeInTheDocument()
      expect(screen.queryByText('infoAlert.adminWritesReviewerSigns')).not.toBeInTheDocument()
      expect(screen.queryByText('infoAlert.reviewerWritesReviewerSigns')).not.toBeInTheDocument()
      expect(getPublishButton()).toBeEnabled()
    })

    it('REJECTED: error chip, top error alert with "read reason" action, no info alert, publish disabled', () => {
      renderWithReviewerWorkflow('REJECTED')

      expect(screen.getByText('chip.rejected')).toBeInTheDocument()
      // Top error alert (rejectedAlert keyPrefix → bare keys via i18n test mock).
      expect(screen.getByText('label')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'action' })).toBeInTheDocument()
      expect(screen.queryByText('infoAlert.adminWritesReviewerSigns')).not.toBeInTheDocument()
      expect(screen.queryByText('infoAlert.reviewerWritesReviewerSigns')).not.toBeInTheDocument()
      expect(getPublishButton()).toBeDisabled()
    })

    it('should not show delete, edit and publish buttons when current user is delegator', () => {
      useQueryMock.mockReturnValue({
        data: {
          ...createMockPurposeCompatiblePersonalDataYes(),
          delegation: {
            id: 'delegation-id',
            delegator: {
              id: 'org-1',
            },
            delegate: {
              id: 'another-org',
            },
          },
        },
        isLoading: false,
      })
      mockUseJwt({ jwt: { organizationId: 'org-1' } })

      renderWithApplicationContext(<ConsumerPurposeSummaryPage />, {
        withReactQueryContext: true,
        withRouterContext: true,
      })

      expect(screen.queryByRole('button', { name: 'deleteDraft' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'editDraft' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'summary.publishBtn' })).not.toBeInTheDocument()
    })
  })
})
