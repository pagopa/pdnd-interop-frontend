import { act, renderHook, waitFor } from '@testing-library/react'
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing'
import { useSorting } from '../useSorting'

const options = [
  { label: 'Name', value: 'name' },
  { label: 'Date', value: 'date' },
  { label: 'Status', value: 'status' },
]

describe('useSorting', () => {
  it('returns the options as passed in', () => {
    const { result } = renderHook(() => useSorting(options), {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(result.current.options).toBe(options)
  })

  it('defaults sortBy to the first option when there is no search param', () => {
    const { result } = renderHook(() => useSorting(options), {
      wrapper: withNuqsTestingAdapter(),
    })

    expect(result.current.sortBy).toBe('name')
  })

  it('reads sortBy from the search params when it is a valid option', () => {
    const { result } = renderHook(() => useSorting(options), {
      wrapper: withNuqsTestingAdapter({ searchParams: '?sortBy=status' }),
    })

    expect(result.current.sortBy).toBe('status')
  })

  it('falls back to the default when the search param is not a valid option', () => {
    const { result } = renderHook(() => useSorting(options), {
      wrapper: withNuqsTestingAdapter({ searchParams: '?sortBy=invalid' }),
    })

    expect(result.current.sortBy).toBe('name')
  })

  it('updates sortBy and the search params when onSortingChange is called', async () => {
    const onUrlUpdate = vi.fn()
    const { result } = renderHook(() => useSorting(options), {
      wrapper: withNuqsTestingAdapter({ onUrlUpdate }),
    })

    await act(async () => {
      result.current.onSortingChange('date')
    })

    expect(result.current.sortBy).toBe('date')
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled())
    const lastCall = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0]
    expect(lastCall.searchParams.get('sortBy')).toBe('date')
  })

  it('keeps a stable onSortingChange reference across rerenders', () => {
    const { result, rerender } = renderHook(() => useSorting(options), {
      wrapper: withNuqsTestingAdapter(),
    })

    const first = result.current.onSortingChange
    rerender()

    expect(result.current.onSortingChange).toBe(first)
  })
})
