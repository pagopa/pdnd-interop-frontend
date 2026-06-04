import { screen } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import RiskAnalysisListPage from '../RiskAnalysisList.page'
import type { RiskAnalysisSigningState } from '@/api/api.generatedTypes'
import { useQuery } from '@tanstack/react-query'
import type * as ReactQuery from '@tanstack/react-query'
import { RiskAnalysisTableSkeleton } from '../components/RiskAnalysisTable'

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

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof ReactQuery>('@tanstack/react-query')

  return {
    ...actual,
    useQuery: vi.fn(),
  }
})

const mockedUseQuery = vi.mocked(useQuery)

describe('RiskAnalysisListPage', () => {
  const renderPage = () =>
    renderWithApplicationContext(<RiskAnalysisListPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

  beforeEach(() => {
    vi.clearAllMocks()

    mockedUseQuery.mockReturnValue({
      data: {
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
      },
      isFetching: false,
    } as unknown as ReturnType<typeof useQuery>)

    renderPage()
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

  it('does not show noData label when data exists', () => {
    expect(screen.queryByText('noData.label')).not.toBeInTheDocument()
  })

  it('does not render noData label while initial data is loading', () => {
    mockedUseQuery.mockReturnValueOnce({
      data: undefined,
      isFetching: true,
    } as unknown as ReturnType<typeof useQuery>)

    renderPage()

    expect(screen.queryByText('noData.label')).not.toBeInTheDocument()
  })

  it('renders skeleton rows', () => {
    const { container } = renderWithApplicationContext(<RiskAnalysisTableSkeleton />, {
      withReactQueryContext: true,
    })

    const skeletons = container.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBeGreaterThanOrEqual(5)
  })
})
