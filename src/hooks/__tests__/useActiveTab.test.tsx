import { waitFor } from '@testing-library/react'
import { useActiveTab } from '../useActiveTab'
import { act } from 'react'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'

const testTabInitialValue = 'firstTab'

function renderActiveTab(searchParams?: Record<string, string>) {
  const onUrlUpdate = vi.fn()
  const { result } = renderHookWithApplicationContext(() => useActiveTab(testTabInitialValue), {
    nuqsTestingAdapterProps: { searchParams, onUrlUpdate, hasMemory: true },
  })

  return { result, onUrlUpdate }
}

describe('determine whether business logic to move among tabs works', () => {
  it('moves between tabs', async () => {
    const { result } = renderActiveTab()

    await act(async () => {
      result.current.updateActiveTab({}, 'fourthTab')
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    expect(result.current.activeTab).toBe('fourthTab')

    await act(async () => {
      result.current.updateActiveTab({}, 'secondTab')
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    expect(result.current.activeTab).toBe('secondTab')
  })

  it('uses the default tab without writing it to the URL', () => {
    const { result, onUrlUpdate } = renderActiveTab()

    expect(result.current.activeTab).toBe(testTabInitialValue)
    expect(onUrlUpdate).not.toHaveBeenCalled()
  })

  it('reads the active tab from the URL', () => {
    const { result } = renderActiveTab({ tab: 'fourthTab' })

    expect(result.current.activeTab).toBe('fourthTab')
  })

  it('preserves other URL params when changing tabs', async () => {
    const { result, onUrlUpdate } = renderActiveTab({ tab: 'fourthTab', test: 'test' })

    act(() => result.current.updateActiveTab({}, 'secondTab'))

    await waitFor(() =>
      expect(Object.fromEntries(onUrlUpdate.mock.lastCall?.[0].searchParams ?? [])).toEqual({
        tab: 'secondTab',
        test: 'test',
      })
    )
  })

  it('sets the tab when it is missing from the URL and preserves other params', async () => {
    const { result, onUrlUpdate } = renderActiveTab({ test: 'test' })

    act(() => result.current.updateActiveTab({}, 'fourthTab'))

    await waitFor(() =>
      expect(Object.fromEntries(onUrlUpdate.mock.lastCall?.[0].searchParams ?? [])).toEqual({
        tab: 'fourthTab',
        test: 'test',
      })
    )
  })

  it('removes offset and signing params when changing tabs', async () => {
    const { result, onUrlUpdate } = renderActiveTab({
      tab: 'fourthTab',
      offset: '1',
      signingStates: 'signed',
      eservicesIds: 'service-1',
      filter: 'active',
    })

    act(() => result.current.updateActiveTab({}, 'secondTab'))

    await waitFor(() =>
      expect(Object.fromEntries(onUrlUpdate.mock.lastCall?.[0].searchParams ?? [])).toEqual({
        tab: 'secondTab',
        filter: 'active',
      })
    )
  })

  it('updates tab state and URL state together', async () => {
    const { result, onUrlUpdate } = renderActiveTab({ offset: '1' })

    act(() => result.current.updateActiveTab({}, 'fourthTab'))

    await waitFor(() => {
      expect(result.current.activeTab).toBe('fourthTab')
      expect(Object.fromEntries(onUrlUpdate.mock.lastCall?.[0].searchParams ?? [])).toEqual({
        tab: 'fourthTab',
      })
    })
  })
})
