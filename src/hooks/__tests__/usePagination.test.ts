import { act } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { usePagination } from '../usePagination'

function renderPagination(
  searchParams?: Record<string, string>,
  options?: { limit: number; limitOptions?: number[] }
) {
  const history = createMemoryHistory()
  const query = new URLSearchParams(searchParams).toString()
  history.push(`/${query ? `?${query}` : ''}`)

  const hook = renderHookWithApplicationContext(
    () => usePagination(options),
    { withRouterContext: true },
    history
  )
  return { ...hook, history }
}

describe('usePagination', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses the default limit, offset, and limit options', () => {
    const { result } = renderPagination()

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
  })

  it('uses supplied defaults and pagination options when URL params are absent', () => {
    const { result } = renderPagination(undefined, { limit: 24, limitOptions: [12, 24, 48] })

    expect(result.current.paginationParams).toEqual({ limit: 24, offset: 0 })
    expect(result.current.paginationProps.itemsPerPageOptions).toEqual({
      limit: 24,
      options: [12, 24, 48],
      onLimitChange: expect.any(Function),
    })
  })

  it('reads limit and offset from the URL and calculates the current page', () => {
    const { result } = renderPagination({ limit: '24', offset: '48' })

    expect(result.current.paginationParams).toEqual({ limit: 24, offset: 48 })
    expect(result.current.paginationProps.page).toBe(3)
  })

  it('falls back for invalid URL params and limits greater than 50', () => {
    const { result } = renderPagination({ limit: '51', offset: '-4' }, { limit: 24 })

    expect(result.current.paginationParams).toEqual({ limit: 10, offset: 0 })
    expect(result.current.paginationProps.page).toBe(1)
  })

  it('calculates total pages for counts, zero, and an undefined count', () => {
    const { result } = renderPagination(undefined, { limit: 10 })

    expect(result.current.getTotalPageCount(21)).toBe(3)
    expect(result.current.getTotalPageCount(0)).toBe(0)
    expect(result.current.getTotalPageCount(undefined)).toBe(0)
  })

  it('sets the offset when changing page and preserves other URL params', () => {
    const scrollSpy = vi.spyOn(window, 'scroll').mockImplementation(() => {})
    const { result, history, rerender } = renderPagination({ filter: 'active' })

    act(() => result.current.paginationProps.onPageChange(3))
    rerender()

    expect(history.location.search).toBe('?filter=active&offset=20')
    expect(result.current.paginationParams.offset).toBe(20)
    expect(result.current.paginationProps.page).toBe(3)
    expect(scrollSpy).toHaveBeenCalledWith(0, 0)
  })

  it('removes the offset when returning to the first page', () => {
    vi.spyOn(window, 'scroll').mockImplementation(() => {})
    const { result, history, rerender } = renderPagination({ filter: 'active', offset: '20' })

    act(() => result.current.paginationProps.onPageChange(1))
    rerender()

    expect(history.location.search).toBe('?filter=active')
    expect(result.current.paginationParams.offset).toBe(0)
    expect(result.current.paginationProps.page).toBe(1)
  })

  it('sets a new limit, removes the offset, and preserves other URL params', () => {
    const scrollSpy = vi.spyOn(window, 'scroll').mockImplementation(() => {})
    const { result, history, rerender } = renderPagination({ filter: 'active', offset: '20' })

    act(() => result.current.paginationProps.itemsPerPageOptions.onLimitChange(24))
    rerender()

    expect(history.location.search).toBe('?filter=active&limit=24')
    expect(result.current.paginationParams).toEqual({ limit: 24, offset: 0 })
    expect(result.current.paginationProps.page).toBe(1)
    expect(scrollSpy).toHaveBeenCalledWith(0, 0)
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
