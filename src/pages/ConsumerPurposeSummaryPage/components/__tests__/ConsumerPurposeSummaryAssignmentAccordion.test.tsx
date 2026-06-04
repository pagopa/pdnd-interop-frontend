import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { ConsumerPurposeSummaryAssignmentAccordion } from '../ConsumerPurposeSummaryAssignmentAccordion'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type { Purpose, ReviewerWorkflow } from '@/api/api.generatedTypes'

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

const setPurpose = (reviewerWorkflow: ReviewerWorkflow | undefined) => {
  const purpose: Purpose = {
    ...createMockPurpose(),
    reviewerWorkflow,
  }
  useSuspenseQueryMock.mockReturnValue({ data: purpose })
}

describe('ConsumerPurposeSummaryAssignmentAccordion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('option 1 (autonomy): reviewerWorkflow undefined → renders only "Modalità" row with autonomy copy', () => {
    setPurpose(undefined)

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('mode.label')).toBeInTheDocument()
    expect(screen.getByText('mode.autonomy')).toBeInTheDocument()
    expect(screen.queryByText('reviewer.label')).not.toBeInTheDocument()
  })

  it('option 2 (ADMIN_WRITES_REVIEWER_SIGNS): renders "Modalità" + "Valutatore" rows', () => {
    setPurpose({
      reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS',
      reviewerIds: [REVIEWER_ID],
      signingState: 'ASSIGNED',
    })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('mode.label')).toBeInTheDocument()
    expect(screen.getByText('mode.adminWritesReviewerSigns')).toBeInTheDocument()
    expect(screen.getByText('reviewer.label')).toBeInTheDocument()
    expect(screen.getByText(REVIEWER_ID)).toBeInTheDocument()
  })

  it('option 3 (REVIEWER_WRITES_REVIEWER_SIGNS): renders "Modalità" + "Valutatore" rows', () => {
    setPurpose({
      reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
      reviewerIds: [REVIEWER_ID],
      signingState: 'ASSIGNED',
    })

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('mode.label')).toBeInTheDocument()
    expect(screen.getByText('mode.reviewerWritesReviewerSigns')).toBeInTheDocument()
    expect(screen.getByText('reviewer.label')).toBeInTheDocument()
    expect(screen.getByText(REVIEWER_ID)).toBeInTheDocument()
  })

  it('fallback: reviewerWorkflow missing on payload → same as option 1', () => {
    setPurpose(undefined)

    renderWithApplicationContext(
      <ConsumerPurposeSummaryAssignmentAccordion purposeId="test-id" />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('mode.label')).toBeInTheDocument()
    expect(screen.getByText('mode.autonomy')).toBeInTheDocument()
    expect(screen.queryByText('reviewer.label')).not.toBeInTheDocument()
  })
})
