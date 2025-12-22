import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Purpose } from '@/api/api.generatedTypes'
import ConsumerPurposeSummaryPage from '../ConsumerPurposeSummary.page'
import { mockUseParams } from '@/utils/testing.utils'
import * as router from '@/router'
import { BrowserRouter as Router } from 'react-router-dom'
import {
  checkIsRulesetExpired,
  getDaysToExpiration,
  getExpirationDateToShow,
} from '@/utils/purpose.utils'

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

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => ({
      jwt: { organizationId: 'org-id' },
    }),
  },
}))

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

vi.mock('@/utils/purpose.utils', () => ({
  checkIsRulesetExpired: vi.fn(),
  getDaysToExpiration: vi.fn(),
  getExpirationDateToShow: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const WrapperComponent = ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(Router, {}, children) // Wrap with Router
    )

  WrapperComponent.displayName = 'TestWrapper'
  return WrapperComponent
}

const mockPurposeAnswerNo: Purpose = {
  id: 'purpose-id',
  title: 'Test Purpose',
  consumer: { id: 'consumer-id', name: 'Consumer Name' },
  eservice: {
    id: 'eservice-id',
    name: 'Test Eservice',
    mode: 'DELIVER',
    producer: { id: 'producer-id', name: 'Producer Name' },
    personalData: true,
    descriptor: {
      id: 'descriptor-id',
      state: 'PUBLISHED',
      version: '1',
      audience: ['test'],
    },
  },
  agreement: { id: 'agreement-id', state: 'ACTIVE', canBeUpgraded: false },
  riskAnalysisForm: {
    answers: { usesPersonalData: ['NO'] },
    version: '3.1',
    riskAnalysisId: 'risk-analysis-id',
  },
  versions: [],
  clients: [],
  description: '',
  isFreeOfCharge: false,
  dailyCallsPerConsumer: 0,
  dailyCallsTotal: 0,
  hasUnreadNotifications: false,
  isDocumentReady: false,
}

const mockPurposeAnswerYes: Purpose = {
  id: 'purpose-id',
  title: 'Test Purpose',
  consumer: { id: 'consumer-id', name: 'Consumer Name' },
  eservice: {
    id: 'eservice-id',
    name: 'Test Eservice',
    mode: 'DELIVER',
    producer: { id: 'producer-id', name: 'Producer Name' },
    personalData: false,
    descriptor: {
      id: 'descriptor-id',
      state: 'PUBLISHED',
      version: '1',
      audience: ['test'],
    },
  },
  agreement: { id: 'agreement-id', state: 'ACTIVE', canBeUpgraded: false },
  riskAnalysisForm: {
    answers: { usesPersonalData: ['YES'] },
    version: '3.1',
    riskAnalysisId: 'risk-analysis-id',
  },
  versions: [],
  clients: [],
  description: '',
  isFreeOfCharge: false,
  dailyCallsPerConsumer: 0,
  dailyCallsTotal: 0,
  hasUnreadNotifications: false,
  isDocumentReady: false,
  rulesetExpiration: '2030-01-01T00:00:00Z',
}

const mockPurposeCompatiblePersonalDataYes: Purpose = {
  ...mockPurposeAnswerNo,
  riskAnalysisForm: {
    ...mockPurposeAnswerNo.riskAnalysisForm!,
    answers: { usesPersonalData: ['YES'] },
  },
}

const mockPurposeCompatiblePersonalDataNo: Purpose = {
  ...mockPurposeAnswerYes,
  riskAnalysisForm: {
    ...mockPurposeAnswerYes.riskAnalysisForm!,
    answers: { usesPersonalData: ['NO'] },
  },
}

describe('ConsumerPurposeSummaryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkIsRulesetExpired).mockReturnValue(false)
    vi.mocked(getDaysToExpiration).mockReturnValue(10)
    vi.mocked(getExpirationDateToShow).mockReturnValue('01/01/2030')
  })

  it('renders page title', () => {
    useQueryMock.mockReturnValue({
      data: mockPurposeAnswerYes,
      isLoading: false,
    })

    render(<ConsumerPurposeSummaryPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Test Purpose')).toBeInTheDocument()
  })

  it('disables publish button when personal data answer is incompatible (case: user answer NO, eservice personalData true)', () => {
    useQueryMock.mockReturnValue({
      data: mockPurposeAnswerNo,
      isLoading: false,
    })

    render(<ConsumerPurposeSummaryPage />, { wrapper: createWrapper() })

    const publishButton = screen.getByRole('button', {
      name: 'publishDraft',
    })

    expect(publishButton).toBeDisabled()
  })

  it('disables publish button when personal data answer is incompatible (case: user answer YES, eservice personalData false)', () => {
    useQueryMock.mockReturnValue({
      data: mockPurposeAnswerYes,
      isLoading: false,
    })

    render(<ConsumerPurposeSummaryPage />, { wrapper: createWrapper() })

    const publishButton = screen.getByRole('button', {
      name: 'publishDraft',
    })

    expect(publishButton).toBeDisabled()
  })

  it('enables publish button when personal data answer is compatible (case: user answer YES, eservice personalData true)', () => {
    useQueryMock.mockReturnValue({
      data: mockPurposeCompatiblePersonalDataYes,
      isLoading: false,
    })

    render(<ConsumerPurposeSummaryPage />, { wrapper: createWrapper() })

    const publishButton = screen.getByRole('button', {
      name: 'publishDraft',
    })

    expect(publishButton).toBeEnabled()
  })

  it('enables publish button when personal data answer is compatible (case: user answer NO, eservice personalData false)', () => {
    useQueryMock.mockReturnValue({
      data: mockPurposeCompatiblePersonalDataNo,
      isLoading: false,
    })

    render(<ConsumerPurposeSummaryPage />, { wrapper: createWrapper() })

    const publishButton = screen.getByRole('button', {
      name: 'publishDraft',
    })

    expect(publishButton).toBeEnabled()
  })

  it('shows info alert when there is an expiration date to show', () => {
    useQueryMock.mockReturnValue({
      data: mockPurposeAnswerYes,
      isLoading: false,
    })

    render(<ConsumerPurposeSummaryPage />, { wrapper: createWrapper() })

    expect(screen.getByText('summary.alerts.infoRulesetExpiration')).toBeInTheDocument()
  })

  it('does not show alert when there is no expiration date to show', () => {
    useQueryMock.mockReturnValue({
      data: mockPurposeAnswerNo,
      isLoading: false,
    })

    render(<ConsumerPurposeSummaryPage />, { wrapper: createWrapper() })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
  it('shows alert if isRulesetExpired is true', () => {
    vi.mocked(checkIsRulesetExpired).mockReturnValue(true)
    vi.mocked(getDaysToExpiration).mockReturnValue(undefined)
    vi.mocked(getExpirationDateToShow).mockReturnValue(undefined)

    useQueryMock.mockReturnValue({
      data: mockPurposeAnswerYes,
      isLoading: false,
    })

    render(<ConsumerPurposeSummaryPage />, { wrapper: createWrapper() })

    expect(screen.getByText('summary.alerts.rulesetExpired.label')).toBeInTheDocument()
  })
})
