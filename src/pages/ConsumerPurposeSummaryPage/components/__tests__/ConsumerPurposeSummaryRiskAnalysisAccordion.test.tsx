import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { ConsumerPurposeSummaryRiskAnalysisAccordion } from '../ConsumerPurposeSummaryRiskAnalysisAccordion'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type { Purpose, RiskAnalysisSigningState } from '@/api/api.generatedTypes'

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

vi.mock('@/components/shared/RiskAnalysisInfoSummary', () => ({
  PurposeRiskAnalysisInfoSummary: () => <div data-testid="risk-analysis-info-summary" />,
}))

const setPurpose = (signingState: RiskAnalysisSigningState | undefined) => {
  const purpose: Purpose = {
    ...createMockPurpose(),
    reviewerWorkflow: signingState
      ? {
          reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
          reviewerIds: ['11111111-2222-3333-4444-555555555555'],
          signingState,
        }
      : undefined,
  }
  useSuspenseQueryMock.mockReturnValue({ data: purpose })
}

describe('ConsumerPurposeSummaryRiskAnalysisAccordion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // The empty-body case (ASSIGNED / awaiting compilation) is handled at page level: the page
  // renders no children, so SummaryAccordion shows only the header. This accordion always
  // renders the answers when mounted.
  it.each<RiskAnalysisSigningState | undefined>(['SUBMITTED', 'SIGNED', 'REJECTED', undefined])(
    'signingState %s: renders the risk analysis answers',
    (signingState) => {
      setPurpose(signingState)

      renderWithApplicationContext(
        <ConsumerPurposeSummaryRiskAnalysisAccordion purposeId="test-id" />,
        { withReactQueryContext: true }
      )

      expect(screen.getByTestId('risk-analysis-info-summary')).toBeInTheDocument()
    }
  )
})
