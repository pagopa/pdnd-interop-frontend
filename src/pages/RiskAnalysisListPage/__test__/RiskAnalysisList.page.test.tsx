import { screen } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import RiskAnalysisListPage from '../RiskAnalysisList.page'
import type { RiskAnalysisSigningState } from '@/api/api.generatedTypes'

vi.mock('@/components/shared/StatusChip', () => ({
  StatusChip: ({ state }: { state: RiskAnalysisSigningState }) => (
    <div data-testid="status-chip">{state}</div>
  ),
}))

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getRiskAnalysisAssignments: () => ({
      queryKey: ['risk-analysis'],
      queryFn: async () => ({
        results: [
          {
            id: '1',
            eservice: {
              name: 'Test E-service',
              producer: { name: 'PagoPA' },
            },
            reviewerWorkflow: {
              signingState: 'ASSIGNED',
              sentToReviewerAt: new Date().toISOString(),
            },
          },
        ],
        pagination: { totalCount: 1 },
      }),
    }),
  },
}))

describe('RiskAnalysisListPage', () => {
  beforeEach(() => {
    renderWithApplicationContext(<RiskAnalysisListPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
  })

  it('renders page title', () => {
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('renders page description', () => {
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('renders filters', () => {
    expect(screen.getByLabelText('filters.eserviceField.label')).toBeInTheDocument()
    expect(screen.getByLabelText('filters.riskAnalysisState.label')).toBeInTheDocument()
  })

  it('renders table row content', async () => {
    expect(await screen.findByText('Test E-service')).toBeInTheDocument()
    expect(screen.getByText('PagoPA')).toBeInTheDocument()
  })

  it('renders status chip', async () => {
    expect(await screen.findByText('ASSIGNED')).toBeInTheDocument()
  })

  it('renders today label', async () => {
    expect(await screen.findByText('today.label')).toBeInTheDocument()
  })
})
