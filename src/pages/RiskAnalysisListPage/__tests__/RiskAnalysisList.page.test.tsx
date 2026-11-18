import { screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import RiskAnalysisListPage from '../RiskAnalysisList.page'

// Feed the query layer with canned data and run each query's `select`, so that the
// option-mapping branch (including the migrated getCompactCatalogList call) executes.
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useQuery: vi.fn((options: { queryKey?: unknown[]; select?: (data: unknown) => unknown }) => {
      const key = Array.isArray(options?.queryKey) ? options.queryKey[0] : undefined
      const eservices = {
        results: [{ id: 'e-1', name: 'E-service 1', producer: { id: 'p-1', name: 'Org 1' } }],
        pagination: { offset: 0, limit: 50, totalCount: 1 },
      }
      const empty = {
        results: [],
        pagination: { offset: 0, limit: 50, totalCount: 0 },
        data: { results: [] },
      }
      const raw = key === 'EServiceGetCompactCatalogList' ? eservices : empty
      const data = typeof options?.select === 'function' ? options.select(raw) : raw
      return { data, isLoading: false, isFetching: false, isSuccess: true, isError: false }
    }),
  }
})

vi.mock('@pagopa/interop-fe-commons', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    Filters: () => <div data-testid="filters" />,
    Pagination: () => <div data-testid="pagination" />,
    useAutocompleteTextInput: () => ['', vi.fn()],
    useFilters: () => ({ filtersParams: { eservicesIds: ['e-1'] } }),
    usePagination: () => ({
      paginationParams: { offset: 0, limit: 10 },
      paginationProps: {},
      getTotalPageCount: () => 1,
      rowPerPageOptions: [10],
    }),
  }
})

vi.mock('../components/RiskAnalysisTable', () => ({
  RiskAnalysisTable: () => <div data-testid="risk-analysis-table" />,
  RiskAnalysisTableSkeleton: () => <div data-testid="risk-analysis-table-skeleton" />,
}))

describe('RiskAnalysisListPage', () => {
  it('renders filters and the risk analysis table, mapping e-service options from the compact catalog endpoint', () => {
    renderWithApplicationContext(<RiskAnalysisListPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('filters')).toBeInTheDocument()
    expect(screen.getByTestId('risk-analysis-table')).toBeInTheDocument()
  })
})
