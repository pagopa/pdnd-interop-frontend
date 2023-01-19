import { renderHookWithApplicationContext } from '@/__mocks__/mock.utils'
import { vi } from 'vitest'
import useScrollTopOnLocationChange from '../useScrollTopOnLocationChange'

const scrollToSpy = vi.spyOn(window, 'scroll')

describe('useScrollTopOnLocationChange tests', () => {
  it('should scroll top on location change', async () => {
    const { history, rerender } = renderHookWithApplicationContext(
      () => useScrollTopOnLocationChange(),
      {
        withRouterContext: true,
      }
    )
    expect(scrollToSpy).toBeCalledTimes(0)

    history.push('/test')
    rerender()

    expect(scrollToSpy).toBeCalledTimes(1)
  })
})
