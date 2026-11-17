import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { ConsumerPurposeSummaryAssignmentAccordion } from '../ConsumerPurposeSummaryAssignmentAccordion'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type { Purpose, ReviewerWorkflow, RiskAnalysisReviewMode } from '@/api/api.generatedTypes'

const useSuspenseQueryMock = vi.fn()
const translationMock = vi.fn((key: string) => key)

vi.mock('react-i18next', async () => {
  const actual = await import('@/../__mocks__/react-i18next')
  return {
    ...actual,
    useTranslation: () => ({ ...actual.useTranslation(), t: translationMock }),
  }
})

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useSuspenseQuery: () => useSuspenseQueryMock(),
  }
})

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (id: string) => ['purpose', id],
  },
}))

const REVIEWER_ID = '11111111-2222-3333-4444-555555555555'
const OTHER_REVIEWER_ID = '66666666-7777-8888-9999-000000000000'

const setPurpose = (
  riskAnalysisReviewMode: RiskAnalysisReviewMode | undefined,
  reviewerWorkflow?: ReviewerWorkflow
) => {
  const purpose: Purpose = {
    ...createMockPurpose(),
    riskAnalysisReviewMode,
    reviewerWorkflow,
  }
  useSuspenseQueryMock.mockReturnValue({ data: purpose })
}

describe('ConsumerPurposeSummaryAssignmentAccordion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each<RiskAnalysisReviewMode | undefined>([undefined, 'ADMIN_WRITES_ADMIN_SIGNS'])(
    'option 1 (autonomy, reviewMode %s): renders only "Modalità" row with autonomy copy',
    (reviewMode) => {
      setPurpose(reviewMode)

      renderWithApplicationContext(
        <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
        { withReactQueryContext: true }
      )

      expect(screen.getByText('mode.label')).toBeInTheDocument()
      expect(screen.getByText('mode.autonomy')).toBeInTheDocument()
      expect(screen.queryByText('reviewer.label')).not.toBeInTheDocument()
    }
  )

  it('option 2 (ADMIN_WRITES_REVIEWER_SIGNS): renders "Modalità" + "Valutatore" rows with the reviewer name', () => {
    setPurpose('ADMIN_WRITES_REVIEWER_SIGNS', {
      reviewers: [{ userId: REVIEWER_ID, name: 'Mario', familyName: 'Rossi' }],
      signingState: 'ASSIGNED',
    })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('mode.label')).toBeInTheDocument()
    expect(screen.getByText('mode.adminWritesReviewerSigns')).toBeInTheDocument()
    expect(screen.getByText('reviewer.label')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
  })

  it('option 3 (REVIEWER_WRITES_REVIEWER_SIGNS): renders "Modalità" + "Valutatore" rows with the reviewer name', () => {
    setPurpose('REVIEWER_WRITES_REVIEWER_SIGNS', {
      reviewers: [{ userId: REVIEWER_ID, name: 'Mario', familyName: 'Rossi' }],
      signingState: 'ASSIGNED',
    })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('mode.label')).toBeInTheDocument()
    expect(screen.getByText('mode.reviewerWritesReviewerSigns')).toBeInTheDocument()
    expect(screen.getByText('reviewer.label')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument()
  })

  it('renders every assigned reviewer as a comma separated list', () => {
    setPurpose('ADMIN_WRITES_REVIEWER_SIGNS', {
      reviewers: [
        { userId: REVIEWER_ID, name: 'Mario', familyName: 'Rossi' },
        { userId: OTHER_REVIEWER_ID, name: 'Luigi', familyName: 'Verdi' },
      ],
      signingState: 'ASSIGNED',
    })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('reviewer.label')).toBeInTheDocument()
    expect(screen.getByText('Mario Rossi, Luigi Verdi')).toBeInTheDocument()
  })

  it('does not render the "Valutatore" row when the reviewer workflow has no reviewers', () => {
    setPurpose('ADMIN_WRITES_REVIEWER_SIGNS', { signingState: 'ASSIGNED' })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('mode.adminWritesReviewerSigns')).toBeInTheDocument()
    expect(screen.queryByText('reviewer.label')).not.toBeInTheDocument()
  })

  it('keeps unavailable assigned reviewers visible and counts them in the label', () => {
    setPurpose('ADMIN_WRITES_REVIEWER_SIGNS', {
      reviewers: [
        { userId: REVIEWER_ID, name: '', familyName: '' },
        { userId: OTHER_REVIEWER_ID, name: 'Luigi', familyName: 'Verdi' },
      ],
      signingState: 'ASSIGNED',
    })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('reviewerUnknown, Luigi Verdi')).toBeInTheDocument()
    expect(translationMock).toHaveBeenCalledWith('reviewer.label', { count: 2 })
  })

  it('keeps the reviewer row when its only assigned reviewer has no available name', () => {
    setPurpose('ADMIN_WRITES_REVIEWER_SIGNS', {
      reviewers: [{ userId: REVIEWER_ID, name: '  ', familyName: '\t' }],
      signingState: 'ASSIGNED',
    })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('reviewer.label')).toBeInTheDocument()
    expect(screen.getByText('reviewerUnknown')).toBeInTheDocument()
    expect(translationMock).toHaveBeenCalledWith('reviewer.label', { count: 1 })
  })

  it('does not render the "Valutatore" row when the reviewers list is empty', () => {
    setPurpose('ADMIN_WRITES_REVIEWER_SIGNS', {
      reviewers: [],
      signingState: 'ASSIGNED',
    })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.queryByText('reviewer.label')).not.toBeInTheDocument()
  })
})
