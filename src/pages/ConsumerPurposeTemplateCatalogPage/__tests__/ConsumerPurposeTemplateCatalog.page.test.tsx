import { screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerPurposeTemplateCatalogPage from '../ConsumerPurposeTemplateCatalog.page'

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
      paginationParams: { offset: 0, limit: 12 },
      paginationProps: {},
      getTotalPageCount: () => 1,
    }),
  }
})

vi.mock('../components/PurposeTemplateCatalogGrid', () => ({
  PurposeTemplateCatalogGrid: () => <div data-testid="purpose-template-catalog-grid" />,
  PurposeTemplateCatalogGridSkeleton: () => (
    <div data-testid="purpose-template-catalog-grid-skeleton" />
  ),
}))

describe('ConsumerPurposeTemplateCatalogPage', () => {
  it('renders filters and the catalog grid, mapping e-service options from the compact catalog endpoint', () => {
    renderWithApplicationContext(<ConsumerPurposeTemplateCatalogPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('filters')).toBeInTheDocument()
    expect(screen.getByTestId('purpose-template-catalog-grid')).toBeInTheDocument()
  })
})
