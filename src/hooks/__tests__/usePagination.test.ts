import { act, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { usePagination } from '../usePagination'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'

function renderPagination(
  searchParams?: Record<string, string>,
  options?: { limit: number; limitOptions?: number[] }
) {
  const query = new URLSearchParams(searchParams).toString()
  const history = createMemoryHistory({ initialEntries: [`/${query ? `?${query}` : ''}`] })
  const onUrlUpdate = vi.fn(({ searchParams }: { searchParams: URLSearchParams }) =>
    searchParams.toString()
  )
  const hook = renderHookWithApplicationContext(
    () => usePagination(options),
    {
      withRouterContext: true,
      nuqsTestingAdapterProps: { searchParams, onUrlUpdate, hasMemory: true },
    },
    history
  )
  return { ...hook, onUrlUpdate }
}

describe('usePagination', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses the default limit, offset, and limit options without writing defaults to the URL', () => {
    const { result, onUrlUpdate } = renderPagination()

    expect(result.current.paginationParams).toEqual({ limit: 10, offset: 0 })
    expect(result.current.paginationProps).toEqual({
      page: 1,
      onPageChange: expect.any(Function),
      itemsPerPageOptions: {
        limit: 10,
        options: [10, 24, 36],
        onLimitChange: expect.any(Function),
      },
    })

    expect(onUrlUpdate).not.toHaveBeenCalled()
  })

  it('uses supplied defaults and pagination options without writing defaults to the URL', () => {
    const { result, onUrlUpdate } = renderPagination(undefined, {
      limit: 24,
      limitOptions: [12, 24, 48],
    })

    expect(result.current.paginationParams).toEqual({ limit: 24, offset: 0 })
    expect(result.current.paginationProps.itemsPerPageOptions).toEqual({
      limit: 24,
      options: [12, 24, 48],
      onLimitChange: expect.any(Function),
    })

    expect(onUrlUpdate).not.toHaveBeenCalled()
  })

  it('reads limit and offset from the URL and calculates the current page', () => {
    const { result } = renderPagination({ limit: '24', offset: '48' })

    expect(result.current.paginationParams).toEqual({ limit: 24, offset: 48 })
    expect(result.current.paginationProps.page).toBe(3)
  })

  it('removes invalid URL params when an offset is present', async () => {
    const { result, onUrlUpdate } = renderPagination({ limit: '51', offset: '-4' }, { limit: 24 })

    expect(result.current.paginationParams).toEqual({ limit: 24, offset: 0 })
    expect(result.current.paginationProps.page).toBe(1)

    await waitFor(() => expect(onUrlUpdate.mock.lastCall?.[0].searchParams.toString()).toBe(''))
  })

  it('calculates total pages for counts, zero, and an undefined count', () => {
    const { result } = renderPagination(undefined, { limit: 10 })

    expect(result.current.getTotalPageCount(21)).toBe(3)
    expect(result.current.getTotalPageCount(0)).toBe(0)
    expect(result.current.getTotalPageCount(undefined)).toBe(0)
  })

  it('sets the offset when changing page and preserves other URL params', async () => {
    const { result, onUrlUpdate } = renderPagination({ filter: 'active' })

    act(() => result.current.paginationProps.onPageChange(3))

    await waitFor(() =>
      expect(Object.fromEntries(onUrlUpdate.mock.lastCall?.[0].searchParams ?? [])).toEqual({
        filter: 'active',
        offset: '20',
      })
    )
    expect(result.current.paginationParams.offset).toBe(20)
    expect(result.current.paginationProps.page).toBe(3)
  })

  it('removes the offset when returning to the first page', async () => {
    const { result, onUrlUpdate } = renderPagination({ filter: 'active', offset: '20' })

    act(() => result.current.paginationProps.onPageChange(1))

    await waitFor(() =>
      expect(Object.fromEntries(onUrlUpdate.mock.lastCall?.[0].searchParams ?? [])).toEqual({
        filter: 'active',
      })
    )
    expect(result.current.paginationParams.offset).toBe(0)
    expect(result.current.paginationProps.page).toBe(1)
  })

  it('sets a new limit, removes the offset, and preserves other URL params', async () => {
    const { result, onUrlUpdate } = renderPagination({ filter: 'active', offset: '20' })

    act(() => result.current.paginationProps.itemsPerPageOptions.onLimitChange(24))

    await waitFor(() =>
      expect(Object.fromEntries(onUrlUpdate.mock.lastCall?.[0].searchParams ?? [])).toEqual({
        filter: 'active',
        limit: '24',
      })
    )
    expect(result.current.paginationParams).toEqual({ limit: 24, offset: 0 })
    expect(result.current.paginationProps.page).toBe(1)
  })

  it('throws when changing to an invalid page or limit', () => {
    const { result } = renderPagination()

    expect(() => act(() => result.current.paginationProps.onPageChange(0))).toThrow(
      'Number of page 0 is not valid'
    )
    expect(() =>
      act(() => result.current.paginationProps.itemsPerPageOptions.onLimitChange(0))
    ).toThrow('Number of items per page 0 is not valid')
  })
})
