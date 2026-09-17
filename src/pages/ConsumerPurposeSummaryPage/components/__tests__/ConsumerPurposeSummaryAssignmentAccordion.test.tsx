import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { ConsumerPurposeSummaryAssignmentAccordion } from '../ConsumerPurposeSummaryAssignmentAccordion'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type { Purpose, ReviewerWorkflow, RiskAnalysisReviewMode } from '@/api/api.generatedTypes'

const useSuspenseQueryMock = vi.fn()

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

const setPurpose = (
  reviewMode: RiskAnalysisReviewMode | undefined,
  reviewerWorkflow?: ReviewerWorkflow
) => {
  const purpose: Purpose = {
    ...createMockPurpose(),
    reviewMode,
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

  it('does not render the "Valutatore" row when the reviewer workflow has no reviewers', () => {
    setPurpose('ADMIN_WRITES_REVIEWER_SIGNS', { signingState: 'ASSIGNED' })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('mode.adminWritesReviewerSigns')).toBeInTheDocument()
    expect(screen.queryByText('reviewer.label')).not.toBeInTheDocument()
  })
})
