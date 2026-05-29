import { screen } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import RiskAnalysisListPage from '../RiskAnalysisList.page'
import type { Purpose } from '@/api/api.generatedTypes'

vi.mock('../components/RiskAnalysisTable', () => ({
  RiskAnalysisTable: ({ purposes }: { purposes: Purpose[] }) => (
    <div data-testid="risk-analysis-table">
      {purposes.map((p: Purpose) => (
        <div key={p.id}>row-{p.id}</div>
      ))}
    </div>
  ),
  RiskAnalysisTableSkeleton: () => <div data-testid="risk-analysis-skeleton">skeleton</div>,
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

  it('should render page title', () => {
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render description', () => {
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('should render filters', () => {
    expect(screen.getByLabelText('eserviceField.label')).toBeInTheDocument()
    expect(screen.getByLabelText('riskAnalysisState.label')).toBeInTheDocument()
  })

  it('should render table', () => {
    expect(screen.getByTestId('risk-analysis-table')).toBeInTheDocument()
  })

  it('should render row data (mocked)', () => {
    expect(screen.getByText('row-1')).toBeInTheDocument()
  })
})
