import { renderHookWithApplicationContext } from '@/__mocks__/mock.utils'
import { createMemoryHistory } from 'history'
import { act } from 'react-dom/test-utils'
import { URLSearchParams } from 'url'
import { useQueryFilters } from '../useQueryFilters'

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

describe('useQueryFilters testing', () => {
  it('Should take the filters state from url search params', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams()
    const { result } = renderHookWithApplicationContext(
      () => useQueryFilters<TestFilters>(testFiltersInitialValues),
      { withRouterContext: true },
      memoryHistory
    )

    expect(result.current.queryFilters).toEqual({
      testFilterString: 'test',
      testFilterArray: ['testArray1', 'testArray2'],
    })

    expect(result.current.filtersFormMethods.getValues()).toEqual({
      testFilterString: 'test',
      testFilterArray: ['testArray1', 'testArray2'],
    })
  })

  it('Should not put unrelated filters search params inside form state', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams({ offset: 'test' })
    const { result } = renderHookWithApplicationContext(
      () => useQueryFilters<TestFilters>(testFiltersInitialValues),
      { withRouterContext: true },
      memoryHistory
    )

    expect(result.current.filtersFormMethods.getValues()).toEqual({
      testFilterString: 'test',
      testFilterArray: ['testArray1', 'testArray2'],
    })
  })

  it('Should clear the filters, te form state and the url search params on clearFilters call', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams()
    const { result, history } = renderHookWithApplicationContext(
      () => useQueryFilters<TestFilters>(testFiltersInitialValues),
      { withRouterContext: true },
      memoryHistory
    )

    act(() => {
      result.current.clearFilters()
    })

    expect(history.location.search).toBe('')
    expect(result.current.queryFilters).toEqual(testFiltersInitialValues)
    expect(result.current.filtersFormMethods.getValues()).toEqual(testFiltersInitialValues)
  })

  it('Should keep the url search params that are not filters related on clearFilters call', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams({ offset: 'test' })
    const { result, history } = renderHookWithApplicationContext(
      () => useQueryFilters<TestFilters>(testFiltersInitialValues),
      { withRouterContext: true },
      memoryHistory
    )

    act(() => {
      result.current.clearFilters()
    })

    expect(history.location.search).toBe('?offset=test')
  })

  it('Should sync the form state with the queryFilters state and the url search params on enableFilters call', async () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams()

    const { result, history } = renderHookWithApplicationContext(
      () => useQueryFilters<TestFilters>(testFiltersInitialValues),
      { withRouterContext: true },
      memoryHistory
    )

    await act(async () => {
      result.current.filtersFormMethods.setValue('testFilterArray', ['a', 'b'])
      result.current.filtersFormMethods.setValue('testFilterString', 'testFilter')
      result.current.enableFilters()
    })

    expect(history.location.search).toBe(
      '?testFilterString=testFilter&testFilterArray=a&testFilterArray=b'
    )
    expect(result.current.queryFilters).toEqual(result.current.filtersFormMethods.getValues())
  })

  it('Should not set url search params that are nullish/empty array on enableFilters call', async () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams()

    const { result, history } = renderHookWithApplicationContext(
      () => useQueryFilters<TestFilters>(testFiltersInitialValues),
      { withRouterContext: true },
      memoryHistory
    )

    await act(async () => {
      result.current.filtersFormMethods.setValue('testFilterArray', [])
      result.current.filtersFormMethods.setValue('testFilterString', '')
      result.current.enableFilters()
    })

    expect(history.location.search).toBe('')
  })
})
