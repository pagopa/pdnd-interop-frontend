import { screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerPurposesListPage from '../ConsumerPurposesList.page'

mockUseJwt()

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
    useFilters: () => ({ filtersParams: {} }),
    usePagination: () => ({
      paginationParams: { offset: 0, limit: 10 },
      paginationProps: {},
      getTotalPageCount: () => 1,
      rowPerPageOptions: [10],
    }),
  }
})

vi.mock('../components', () => ({
  ConsumerPurposesTable: () => <div data-testid="consumer-purposes-table" />,
  ConsumerPurposesTableSkeleton: () => <div data-testid="consumer-purposes-table-skeleton" />,
}))

describe('ConsumerPurposesListPage', () => {
  it('renders filters and the purposes table, mapping e-service options from the compact catalog endpoint', () => {
    renderWithApplicationContext(<ConsumerPurposesListPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('filters')).toBeInTheDocument()
    expect(screen.getByTestId('consumer-purposes-table')).toBeInTheDocument()
  })
})
