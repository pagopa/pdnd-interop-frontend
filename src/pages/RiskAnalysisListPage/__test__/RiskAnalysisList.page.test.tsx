import { screen } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import RiskAnalysisListPage from '../RiskAnalysisList.page'
import type { RiskAnalysisSigningState } from '@/api/api.generatedTypes'
import { useQuery } from '@tanstack/react-query'
import type * as ReactQuery from '@tanstack/react-query'
import { RiskAnalysisTableSkeleton } from '../components/RiskAnalysisTable'
import { useFilters } from '@pagopa/interop-fe-commons'

vi.mock('@pagopa/interop-fe-commons', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('@pagopa/interop-fe-commons')>(
    '@pagopa/interop-fe-commons'
  )

  return {
    ...actual,
    useFilters: vi.fn(),
    Filters: () => <div data-testid="filters" />,
  }
})

const mockedUseFilters = vi.mocked(useFilters)

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

    mockedUseFilters.mockReturnValue({
      filtersParams: {},
      fields: [],
      activeFilters: [],
      onChangeActiveFilter: vi.fn(),
      onRemoveActiveFilter: vi.fn(),
      onResetActiveFilters: vi.fn(),
    } as unknown as ReturnType<typeof useFilters>)
  })

  it('should render page title', () => {
    renderPage()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render page description', () => {
    renderPage()
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('should render empty page description', () => {
    mockedUseQuery.mockReturnValue({
      data: {
        results: [],
        pagination: { totalCount: 0 },
      },
      isFetching: false,
    } as unknown as ReturnType<typeof useQuery>)

    renderPage()

    expect(screen.getByText('emptyDescription')).toBeInTheDocument()
  })

  it('should render filters', () => {
    renderPage()
    expect(screen.getByTestId('filters')).toBeInTheDocument()
  })

  it('should render table row content', async () => {
    renderPage()
    expect(await screen.findByText('Test E-service')).toBeInTheDocument()
    expect(screen.getByText('PagoPA')).toBeInTheDocument()
  })

  it('should render status chip', async () => {
    renderPage()
    expect(await screen.findByText('ASSIGNED')).toBeInTheDocument()
  })

  it('should render today label', async () => {
    renderPage()
    expect(await screen.findByText('today.label')).toBeInTheDocument()
  })

  it('should not show noData label when data exists', () => {
    renderPage()
    expect(screen.queryByText('noData.label')).not.toBeInTheDocument()
  })

  it('should not render noData label while initial data is loading', () => {
    mockedUseQuery.mockReturnValueOnce({
      data: undefined,
      isFetching: true,
    } as unknown as ReturnType<typeof useQuery>)

    renderPage()

    expect(screen.queryByText('noData.label')).not.toBeInTheDocument()
  })

  it('should render skeleton rows', () => {
    const { container } = renderWithApplicationContext(<RiskAnalysisTableSkeleton />, {
      withReactQueryContext: true,
    })

    const skeletons = container.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBeGreaterThanOrEqual(5)
  })

  it('should not render initial empty state when filters are active and results are empty', () => {
    mockedUseQuery.mockReturnValue({
      data: {
        results: [],
        pagination: { totalCount: 0 },
      },
      isFetching: false,
    } as unknown as ReturnType<typeof useQuery>)

    mockedUseFilters.mockReturnValue({
      filtersParams: {
        signingStates: 'ASSIGNED',
      },
      fields: [],
      activeFilters: [],
      onChangeActiveFilter: vi.fn(),
      onRemoveActiveFilter: vi.fn(),
      onResetActiveFilters: vi.fn(),
    } as unknown as ReturnType<typeof useFilters>)

    renderPage()

    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.queryByText('emptyDescription')).not.toBeInTheDocument()
    expect(screen.queryByText('noData.label')).not.toBeInTheDocument()
  })
})
