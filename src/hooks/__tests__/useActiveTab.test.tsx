import { act } from 'react-dom/test-utils'
import { createMemoryHistory } from 'history'
import { renderHookWithApplicationContext } from '@/__mocks__/mock.utils'
import { useActiveTab } from '../useActiveTab'

const testTabInitialValue = 'firstTab'

function createMemoryHistoryWithTestSearchParams(searchParams?: Record<string, string>) {
  const memoryHistory = createMemoryHistory()

  const additionalSearchParams = new URLSearchParams(searchParams).toString()

  memoryHistory.push(`/${additionalSearchParams ? '?' + additionalSearchParams : ''}`)

  return memoryHistory
}

describe('determine whether business logic to move among tabs works', () => {
  it('moves between tabs', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams()
    const { result, rerender } = renderHookWithApplicationContext(
      () => useActiveTab(testTabInitialValue),
      { withRouterContext: true },
      memoryHistory
    )

    act(() => {
      result.current.updateActiveTab({}, 'fourthTab')
    })
    rerender()
    expect(result.current.activeTab).toBe('fourthTab')

    act(() => {
      result.current.updateActiveTab({}, 'secondTab')
    })
    rerender()
    expect(result.current.activeTab).toBe('secondTab')
  })

  it('sets index with history', () => {
    const tab = 'fourthTab'
    const memoryHistory = createMemoryHistoryWithTestSearchParams({ tab: tab })
    const { result } = renderHookWithApplicationContext(
      () => useActiveTab(testTabInitialValue),
      { withRouterContext: true },
      memoryHistory
    )

    expect(result.current.activeTab).toBe('fourthTab')
  })

  it('moves between tabs preserving URL params on tab change - with tab search param specified', () => {
    const tab = 'fourthTab'
    const memoryHistory = createMemoryHistoryWithTestSearchParams({ tab: tab, test: 'test' })
    const { result, rerender } = renderHookWithApplicationContext(
      () => useActiveTab(testTabInitialValue),
      { withRouterContext: true },
      memoryHistory
    )

    act(() => {
      result.current.updateActiveTab({}, 'fourthTab')
    })
    rerender()
    expect(memoryHistory.location.search).toBe('?tab=fourthTab&test=test')

    act(() => {
      result.current.updateActiveTab({}, 'secondTab')
    })
    rerender()
    expect(memoryHistory.location.search).toBe('?tab=secondTab&test=test')
  })

  it('moves between tabs preserving URL params on tab change - without tab search param specified', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams({ test: 'test' })
    const { result, rerender } = renderHookWithApplicationContext(
      () => useActiveTab(testTabInitialValue),
      { withRouterContext: true },
      memoryHistory
    )

    act(() => {
      result.current.updateActiveTab({}, 'fourthTab')
    })
    rerender()
    expect(memoryHistory.location.search).toBe('?test=test&tab=fourthTab')

    act(() => {
      result.current.updateActiveTab({}, 'secondTab')
    })
    rerender()
    expect(memoryHistory.location.search).toBe('?test=test&tab=secondTab')
  })

  it('url params/state synchronization tests while moves between tabs', () => {
    const memoryHistory = createMemoryHistoryWithTestSearchParams()
    const { result, rerender } = renderHookWithApplicationContext(
      () => useActiveTab(testTabInitialValue),
      { withRouterContext: true },
      memoryHistory
    )

    act(() => {
      result.current.updateActiveTab({}, 'fourthTab')
    })
    rerender()
    const searchParams = new URLSearchParams(memoryHistory.location.search)
    expect(result.current.activeTab).toBe(searchParams.get('tab'))
  })
})
