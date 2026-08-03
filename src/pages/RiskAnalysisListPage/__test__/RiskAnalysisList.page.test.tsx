import { screen } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import RiskAnalysisListPage from '../RiskAnalysisList.page'
import type { RiskAnalysisSigningState } from '@/api/api.generatedTypes'
import { useQuery } from '@tanstack/react-query'
import type * as ReactQuery from '@tanstack/react-query'
import { RiskAnalysisTable, RiskAnalysisTableSkeleton } from '../components/RiskAnalysisTable'

const mockUseActiveTab = vi.fn()

vi.mock('@/components/shared/StatusChip', () => ({
  StatusChip: ({ state }: { state: RiskAnalysisSigningState }) => (
    <div data-testid="status-chip">{state}</div>
  ),
  StatusChipSkeleton: () => <div data-testid="status-chip-skeleton" />,
}))

vi.mock('@/hooks/useActiveTab', () => ({
  useActiveTab: () => mockUseActiveTab(),
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

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getCatalogList: () => ({
      queryKey: ['eservices'],
      queryFn: async () => ({
        results: [],
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

    mockUseActiveTab.mockReturnValue({
      activeTab: 'todo',
      updateActiveTab: vi.fn(),
    })

    mockedUseQuery
      .mockReturnValueOnce({
        data: [],
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: {
          results: [{ id: '1' }],
        },
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
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
          pagination: {
            totalCount: 1,
          },
        },
        isFetching: false,
      } as unknown as ReturnType<typeof useQuery>)

    renderPage()
  })

  it('should render page title', () => {
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render page description', () => {
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('should render tabs', () => {
    expect(screen.getByRole('tab', { name: 'tabs.todo' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'tabs.done' })).toBeInTheDocument()
  })

  it('should render filters', () => {
    expect(screen.getByLabelText('filters.eserviceField.label')).toBeInTheDocument()
    expect(screen.getByLabelText('filters.riskAnalysisState.label')).toBeInTheDocument()
  })

  it('should render table row content', async () => {
    expect(await screen.findByText('Test E-service')).toBeInTheDocument()
    expect(screen.getByText('PagoPA')).toBeInTheDocument()
  })

  it('should render status chip', async () => {
    expect(await screen.findByText('ASSIGNED')).toBeInTheDocument()
  })

  it('should render today label', async () => {
    expect(await screen.findByText('today.label')).toBeInTheDocument()
  })

  it('should not show noData label when data exists', () => {
    expect(screen.queryByText('noData.label')).not.toBeInTheDocument()
  })

  it('should not render noData label while initial data is loading', () => {
    mockedUseQuery
      .mockReturnValueOnce({
        data: [],
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: undefined,
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: undefined,
        isFetching: true,
      } as unknown as ReturnType<typeof useQuery>)

    renderPage()

    expect(screen.queryByText('noData.label')).not.toBeInTheDocument()
  })

  it('should render initial empty state', () => {
    mockedUseQuery
      .mockReturnValueOnce({
        data: [],
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: {
          results: [],
        },
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: {
          results: [],
          pagination: {
            totalCount: 0,
          },
        },
        isFetching: false,
      } as unknown as ReturnType<typeof useQuery>)

    renderPage()

    expect(screen.getByText('noData.label')).toBeInTheDocument()
  })

  it('should render empty todo tab', () => {
    mockedUseQuery
      .mockReturnValueOnce({
        data: [],
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: {
          results: [{ id: '1' }],
        },
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: {
          results: [],
          pagination: {
            totalCount: 0,
          },
        },
        isFetching: false,
      } as unknown as ReturnType<typeof useQuery>)

    renderPage()

    expect(screen.getByText('emptyTodo')).toBeInTheDocument()
  })

  it('should render empty done tab', () => {
    mockUseActiveTab.mockReturnValue({
      activeTab: 'done',
      updateActiveTab: vi.fn(),
    })

    mockedUseQuery
      .mockReturnValueOnce({
        data: [],
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: {
          results: [{ id: '1' }],
        },
      } as unknown as ReturnType<typeof useQuery>)
      .mockReturnValueOnce({
        data: {
          results: [],
          pagination: {
            totalCount: 0,
          },
        },
        isFetching: false,
      } as unknown as ReturnType<typeof useQuery>)

    renderPage()

    expect(screen.getByText('emptyDone')).toBeInTheDocument()
  })

  it('should render done table headers', () => {
    mockUseActiveTab.mockReturnValue({
      activeTab: 'done',
      updateActiveTab: vi.fn(),
    })

    renderWithApplicationContext(<RiskAnalysisTable purposes={[]} />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('approvalDate')).toBeInTheDocument()
    expect(screen.getByText('reviewer')).toBeInTheDocument()
  })

  it('should render skeleton rows', () => {
    const { container } = renderWithApplicationContext(<RiskAnalysisTableSkeleton />, {
      withReactQueryContext: true,
    })

    const skeletons = container.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBeGreaterThanOrEqual(5)
  })
})
