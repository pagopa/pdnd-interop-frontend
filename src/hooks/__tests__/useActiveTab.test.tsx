import { act } from 'react-dom/test-utils'
import { createMemoryHistory } from 'history'

import { renderHookWithApplicationContext } from '@/__mocks__/mock.utils'
import { useActiveTab } from '../useActiveTab'

const testTabInitialValue = 'firstTab'

function createMemoryHistoryWithTestSearchParams(initialTab = 'firstTab') {
  const memoryHistory = createMemoryHistory()

  memoryHistory.push(`/?tab=${initialTab}`)

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
    const memoryHistory = createMemoryHistoryWithTestSearchParams(tab)
    const { result } = renderHookWithApplicationContext(
      () => useActiveTab(testTabInitialValue),
      { withRouterContext: true },
      memoryHistory
    )

    expect(result.current.activeTab).toBe('fourthTab')
  })
})
