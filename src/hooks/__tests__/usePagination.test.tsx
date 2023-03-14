import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { act } from '@testing-library/react'
import { throws } from 'assert'
import { createMemoryHistory } from 'history'
import { URLSearchParams } from 'url'
import { usePagination } from '../usePagination'

function createMemoryHistoryWithTestSearchParams(searchParams: Record<string, string> = {}) {
  const memoryHistory = createMemoryHistory()

  const additionalSearchParams = new URLSearchParams(searchParams).toString()

  memoryHistory.push(
    `/?${additionalSearchParams}&testFilterString=test&testFilterArray=testArray1&testFilterArray=testArray2`
  )
  return memoryHistory
}

describe('usePagination testing', () => {
  it('Should take initial state from url search params', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams()
    const { result } = renderHookWithApplicationContext(
      () => usePagination({ limit: 10 }),
      { withRouterContext: true },
      memoryHistory
    )

    expect(result.current.paginationParams).toEqual({
      limit: 10,
      offset: 0,
    })
  })

  it('Should keep the offset param and pageNum prop in sync with the offset url param', () => {
    const { result, rerender, history } = renderHookWithApplicationContext(
      () => usePagination({ limit: 25 }),
      { withRouterContext: true }
    )

    history.push('/?offset=50')
    rerender()
    expect(result.current.paginationParams.offset).toEqual(50)
    expect(result.current.paginationProps.pageNum).toEqual(3)

    history.push('/?offset=100')
    rerender()
    expect(result.current.paginationParams.offset).toEqual(100)
    expect(result.current.paginationProps.pageNum).toEqual(5)

    history.push('/?offset=150')
    rerender()
    expect(result.current.paginationParams.offset).toEqual(150)
    expect(result.current.paginationProps.pageNum).toEqual(7)
  })

  it('Should update the offset url param on page change', () => {
    const { result, history } = renderHookWithApplicationContext(
      () => usePagination({ limit: 25 }),
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
      () => usePagination({ limit: 25 }),
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
      () => usePagination({ limit: 20 }),
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
      expect(result.current.paginationParams.offset).toEqual(expectedResult)
    })

    throws(() => {
      result.current.paginationProps.onPageChange(0)
    })
  })

  it('Should get the correct total page count', () => {
    const { result } = renderHookWithApplicationContext(() => usePagination({ limit: 25 }), {
      withRouterContext: true,
    })

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
