import React from 'react'
import { renderHook } from '@testing-library/react'
import usePagination from '../usePagination'
import { MemoryRouter, Route, Router, Routes } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import { createMemoryHistory } from 'history'
import { throws } from 'assert'

describe('usePagination tests', () => {
  it('Should keep the offset param and pageNum prop in sync with the offset url param', () => {
    const history = createMemoryHistory()

    const { result, rerender } = renderHook(() => usePagination({ limit: 25 }), {
      wrapper: ({ children }) => (
        <Router location={history.location} navigator={history}>
          <Routes>
            <Route path="/" element={children} />
          </Routes>
        </Router>
      ),
    })

    history.push('/?offset=50')
    rerender()
    expect(result.current.params.offset).toEqual(50)
    expect(result.current.props.pageNum).toEqual(3)

    history.push('/?offset=100')
    rerender()
    expect(result.current.params.offset).toEqual(100)
    expect(result.current.props.pageNum).toEqual(5)

    history.push('/?offset=150')
    rerender()
    expect(result.current.params.offset).toEqual(150)
    expect(result.current.props.pageNum).toEqual(7)
  })

  it('Should update the offset url param on page change', () => {
    const history = createMemoryHistory()

    const { result } = renderHook(() => usePagination({ limit: 25 }), {
      wrapper: ({ children }) => (
        <Router location={history.location} navigator={history}>
          <Routes>
            <Route path="/" element={children} />
          </Routes>
        </Router>
      ),
    })

    expect(history.location.search).toEqual('')

    act(() => {
      result.current.props.onPageChange(2)
    })

    expect(history.location.search).toEqual('?offset=25')

    act(() => {
      result.current.props.onPageChange(3)
    })

    expect(history.location.search).toEqual('?offset=50')
  })

  it('Should keep the other url params when changing the offset param', () => {
    const history = createMemoryHistory()
    history.push('/?test=0')

    const { result } = renderHook(() => usePagination({ limit: 25 }), {
      wrapper: ({ children }) => (
        <Router location={history.location} navigator={history}>
          <Routes>
            <Route path="/" element={children} />
          </Routes>
        </Router>
      ),
    })

    expect(history.location.search).toEqual('?test=0')

    act(() => {
      result.current.props.onPageChange(2)
    })

    expect(history.location.search).toContain('test=0')

    act(() => {
      result.current.props.onPageChange(3)
    })

    expect(history.location.search).toContain('test=0')
  })

  it('Should handle page changes correctly', () => {
    const { result } = renderHook(() => usePagination({ limit: 20 }), {
      wrapper: MemoryRouter,
    })

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
        result.current.props.onPageChange(Number(pageNum))
      })
      expect(result.current.params.offset).toEqual(expectedResult)
    })

    throws(() => {
      result.current.props.onPageChange(0)
    })
  })

  it('Should get the correct total page count', () => {
    const { result } = renderHook(() => usePagination({ limit: 25 }), {
      wrapper: MemoryRouter,
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
