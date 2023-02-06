import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { act } from '@testing-library/react'
import { throws } from 'assert'
import { createMemoryHistory } from 'history'
import { URLSearchParams } from 'url'
import { useListingParams } from '../useListingParams'

type TestFilters = {
  testFilterString: string
  testFilterArray: Array<string>
}

const testFiltersInitialValues = { testFilterString: '', testFilterArray: [] }

function createMemoryHistoryWithTestSearchParams(searchParams: Record<string, string> = {}) {
  const memoryHistory = createMemoryHistory()

  const additionalSearchParams = new URLSearchParams(searchParams).toString()

  memoryHistory.push(
    `/?${additionalSearchParams}&testFilterString=test&testFilterArray=testArray1&testFilterArray=testArray2`
  )
  return memoryHistory
}

describe('useListingParams testing', () => {
  it('Should take the filters state from url search params', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams()
    const { result } = renderHookWithApplicationContext(
      () =>
        useListingParams<TestFilters>({
          paginationOptions: { limit: 10 },
          filterParams: testFiltersInitialValues,
        }),
      { withRouterContext: true },
      memoryHistory
    )

    expect(result.current.params).toEqual({
      limit: 10,
      offset: 0,
      testFilterString: 'test',
      testFilterArray: ['testArray1', 'testArray2'],
    })

    expect(result.current.filtersUseFormMethods.getValues()).toEqual({
      testFilterString: 'test',
      testFilterArray: ['testArray1', 'testArray2'],
    })
  })

  it('Should not put unrelated filters search params inside form state', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams({ offset: 'test' })
    const { result } = renderHookWithApplicationContext(
      () =>
        useListingParams<TestFilters>({
          paginationOptions: { limit: 10 },
          filterParams: testFiltersInitialValues,
        }),
      { withRouterContext: true },
      memoryHistory
    )

    expect(result.current.filtersUseFormMethods.getValues()).toEqual({
      testFilterString: 'test',
      testFilterArray: ['testArray1', 'testArray2'],
    })
  })

  it('Should clear the filters, the form state and the url search params on clearFilters call', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams()
    const { result, history } = renderHookWithApplicationContext(
      () =>
        useListingParams<TestFilters>({
          paginationOptions: { limit: 10 },
          filterParams: testFiltersInitialValues,
        }),
      { withRouterContext: true },
      memoryHistory
    )

    act(() => {
      result.current.clearFilters()
    })

    expect(history.location.search).toBe('')
    expect(result.current.params).toEqual({ limit: 10, offset: 0, ...testFiltersInitialValues })
    expect({ ...result.current.filtersUseFormMethods.getValues() }).toEqual(
      testFiltersInitialValues
    )
  })

  it('Should keep the url search params that are not filters related on clearFilters call', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams({ test: 'test' })
    const { result, history } = renderHookWithApplicationContext(
      () =>
        useListingParams<TestFilters>({
          paginationOptions: { limit: 10 },
          filterParams: testFiltersInitialValues,
        }),
      { withRouterContext: true },
      memoryHistory
    )

    act(() => {
      result.current.clearFilters()
    })

    expect(history.location.search).toBe('?test=test')
  })

  it('Should sync the form state with the queryFilters state and the url search params on enableFilters call', async () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams()

    const { result, history } = renderHookWithApplicationContext(
      () =>
        useListingParams<TestFilters>({
          paginationOptions: { limit: 10 },
          filterParams: testFiltersInitialValues,
        }),
      { withRouterContext: true },
      memoryHistory
    )

    await act(async () => {
      result.current.filtersUseFormMethods.setValue('testFilterArray', ['a', 'b'])
      result.current.filtersUseFormMethods.setValue('testFilterString', 'testFilter')
      result.current.enableFilters()
    })

    expect(history.location.search).toBe(
      '?testFilterString=testFilter&testFilterArray=a&testFilterArray=b'
    )
    expect(result.current.params).toEqual({
      ...result.current.filtersUseFormMethods.getValues(),
      limit: 10,
      offset: 0,
    })
  })

  it('Should not set url search params that are nullish/empty array on enableFilters call', async () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams()

    const { result, history } = renderHookWithApplicationContext(
      () =>
        useListingParams<TestFilters>({
          paginationOptions: { limit: 10 },
          filterParams: testFiltersInitialValues,
        }),
      { withRouterContext: true },
      memoryHistory
    )

    await act(async () => {
      result.current.filtersUseFormMethods.setValue('testFilterArray', [])
      result.current.filtersUseFormMethods.setValue('testFilterString', '')
      result.current.enableFilters()
    })

    expect(history.location.search).toBe('')
  })

  it('Should keep the offset param and pageNum prop in sync with the offset url param', () => {
    const { result, rerender, history } = renderHookWithApplicationContext(
      () =>
        useListingParams({
          paginationOptions: { limit: 25 },
          filterParams: {},
        }),
      { withRouterContext: true }
    )

    history.push('/?offset=50')
    rerender()
    expect(result.current.params.offset).toEqual(50)
    expect(result.current.paginationProps.pageNum).toEqual(3)

    history.push('/?offset=100')
    rerender()
    expect(result.current.params.offset).toEqual(100)
    expect(result.current.paginationProps.pageNum).toEqual(5)

    history.push('/?offset=150')
    rerender()
    expect(result.current.params.offset).toEqual(150)
    expect(result.current.paginationProps.pageNum).toEqual(7)
  })

  it('Should update the offset url param on page change', () => {
    const { result, history } = renderHookWithApplicationContext(
      () =>
        useListingParams({
          paginationOptions: { limit: 25 },
          filterParams: {},
        }),
      { withRouterContext: true }
    )

    expect(history.location.search).toEqual('')

    act(() => {
      result.current.paginationProps.onPageChange(2)
    })

    expect(history.location.search).toEqual('?offset=25')

    act(() => {
      result.current.paginationProps.onPageChange(3)
    })

    expect(history.location.search).toEqual('?offset=50')
  })

  it('Should keep the other url params when changing the offset param', () => {
    const history = createMemoryHistory()
    history.push('/?test=0')

    const { result } = renderHookWithApplicationContext(
      () =>
        useListingParams({
          paginationOptions: { limit: 25 },
          filterParams: {},
        }),
      { withRouterContext: true },
      history
    )

    expect(history.location.search).toEqual('?test=0')

    act(() => {
      result.current.paginationProps.onPageChange(2)
    })

    expect(history.location.search).toContain('test=0')

    act(() => {
      result.current.paginationProps.onPageChange(3)
    })

    expect(history.location.search).toContain('test=0')
  })

  it('Should handle page changes correctly', () => {
    const { result, rerender } = renderHookWithApplicationContext(
      () =>
        useListingParams({
          paginationOptions: { limit: 20 },
          filterParams: {},
        }),
      { withRouterContext: true }
    )

    // Record<PageNum, ExpectedResult>
    const TEST_CASES = {
      2: 20,
      1: 0,
      3: 40,
      4: 60,
      99: 1960,
      1000: 19980,
      9999: 199960,
    }

    Object.entries(TEST_CASES).forEach(([pageNum, expectedResult]) => {
      act(() => {
        result.current.paginationProps.onPageChange(Number(pageNum))
      })
      rerender()
      expect(result.current.params.offset).toEqual(expectedResult)
    })

    throws(() => {
      result.current.paginationProps.onPageChange(0)
    })
  })

  it('Should get the correct total page count', () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useListingParams({
          paginationOptions: { limit: 25 },
          filterParams: {},
        }),
      { withRouterContext: true }
    )

    // Record<TotalCount, ExpectedResult>
    const TEST_CASES = {
      99: 4,
      430: 18,
      10: 1,
      26: 2,
      24: 1,
    }

    Object.entries(TEST_CASES).forEach(([totalCount, expectedResult]) => {
      expect(result.current.getTotalPageCount(Number(totalCount))).toEqual(expectedResult)
    })
  })
})
