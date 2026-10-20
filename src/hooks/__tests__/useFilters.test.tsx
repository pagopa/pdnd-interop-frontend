import { act } from '@testing-library/react'
import { useFilters } from '../useFilters'
import type { FilterFields, AdditionalFiltersSection } from '@/types/filters.types'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'

type TestFiltersParams = {
  keyword: string
  num: string
  isActive: string
  createdAt: string
  mode: string
  tags: string
  category: string
  status: string
}

const mainFields: FilterFields<keyof TestFiltersParams> = [
  { name: 'keyword', label: 'Keyword', type: 'freetext' },
  { name: 'num', label: 'Num', type: 'numeric' },
  { name: 'isActive', label: 'Is active', type: 'boolean' },
  { name: 'createdAt', label: 'Created at', type: 'datepicker' },
  {
    name: 'mode',
    label: 'Mode',
    type: 'autocomplete-single',
    options: [
      { label: 'MODE-1', value: 'mode-1' },
      { label: 'MODE-2', value: 'mode-2' },
    ],
  },
  {
    name: 'tags',
    label: 'Tags',
    type: 'autocomplete-multiple',
    options: [
      { label: 'TAG-1', value: 'tag-1' },
      { label: 'TAG-2', value: 'tag-2' },
    ],
  },
]

const additionalsSections: AdditionalFiltersSection<keyof TestFiltersParams>[] = [
  {
    title: 'Side section',
    fields: [
      {
        name: 'category',
        label: 'Category',
        type: 'select-single',
        options: [
          { label: 'CAT-1', value: 'cat-1' },
          { label: 'CAT-2', value: 'cat-2' },
        ],
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select-multiple',
        options: [
          { label: 'STATE-1', value: 'state-1' },
          { label: 'STATE-2', value: 'state-2' },
        ],
      },
    ],
  },
]

describe('useFilters', () => {
  it('returns the main and side fields as passed in', () => {
    const { result } = renderHookWithApplicationContext(
      () => useFilters(mainFields, additionalsSections),
      {
        nuqsTestingAdapterProps: {},
      }
    )

    expect(result.current.fields).toBe(mainFields)
    expect(result.current.additionals).toBe(additionalsSections)
  })

  it('returns empty/default filters values when there are no search params', () => {
    const { result } = renderHookWithApplicationContext(
      () => useFilters(mainFields, additionalsSections),
      {
        nuqsTestingAdapterProps: {},
      }
    )

    expect(result.current.filters).toEqual({
      keyword: null,
      num: null,
      isActive: null,
      createdAt: null,
      mode: null,
      tags: null,
      category: null,
      status: null,
    })
  })

  it('parses filters values already present in the search params', () => {
    const { result } = renderHookWithApplicationContext(
      () => useFilters(mainFields, additionalsSections),
      {
        nuqsTestingAdapterProps: {
          searchParams:
            '?keyword=keyword-1&num=42&isActive=true&status=state-1,state-2&tags=tag-1,tag-2&category=cat-1&mode=mode-1',
        },
      }
    )

    expect(result.current.filters).toMatchObject({
      keyword: 'keyword-1',
      num: 42,
      isActive: true,
      status: ['state-1', 'state-2'],
      tags: ['tag-1', 'tag-2'],
      category: 'cat-1',
      mode: 'mode-1',
    })
  })

  it('updates the search params and the filters value when onChangeActiveFilters is called', async () => {
    const onUrlUpdate = vi.fn()
    const { result } = renderHookWithApplicationContext(
      () => useFilters(mainFields, additionalsSections),
      {
        nuqsTestingAdapterProps: { onUrlUpdate },
      }
    )

    await act(async () => {
      result.current.onChangeActiveFilters({ keyword: 'keyword-1', num: '30' })
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.filters).toMatchObject({ keyword: 'keyword-1', num: '30' })
    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        searchParams: expect.any(URLSearchParams),
      })
    )
  })

  it('merges new values with the existing filters when onChangeActiveFilters is called', () => {
    const { result } = renderHookWithApplicationContext(
      () => useFilters(mainFields, additionalsSections),
      {
        nuqsTestingAdapterProps: { searchParams: '?keyword=keyword-1', hasMemory: true },
      }
    )

    act(() => {
      result.current.onChangeActiveFilters({ num: '25' })
    })

    expect(result.current.filters).toMatchObject({ keyword: 'keyword-1', num: '25' })
  })

  it('resets all the filters to null when onResetActiveFilters is called', () => {
    const { result } = renderHookWithApplicationContext(
      () => useFilters(mainFields, additionalsSections),
      {
        nuqsTestingAdapterProps: {
          searchParams: '?keyword=keyword-1&num=42&isActive=true',
          hasMemory: true,
        },
      }
    )

    act(() => {
      result.current.onResetActiveFilters()
    })

    expect(result.current.filters).toEqual({
      keyword: null,
      num: null,
      isActive: null,
      createdAt: null,
      status: null,
      tags: null,
      category: null,
      mode: null,
    })
  })

  it('works correctly when no side filters sections are passed', () => {
    const { result } = renderHookWithApplicationContext(() => useFilters(mainFields), {
      nuqsTestingAdapterProps: {},
    })

    expect(result.current.additionals).toBeUndefined()
    expect(result.current.filters).toEqual({
      keyword: null,
      num: null,
      isActive: null,
      createdAt: null,
      mode: null,
      tags: null,
    })
  })
})
