import { vitest } from 'vitest'
import { setExponentialInterval, clearExponentialInterval } from '../react-query-wrappers.utils'

beforeEach(() => {
  vitest.useFakeTimers()
  vitest.spyOn(global, 'setTimeout')
})

describe('setExponentialInterval tests', () => {
  it('calls the given function with an exponential interval', async () => {
    const testFn = vitest.fn()
    setExponentialInterval(testFn, 20 * 1000)

    for (let i = 1; i <= 6; i++) {
      expect(testFn).toBeCalledTimes(i - 1)
      expect(setTimeout).toBeCalledTimes(i)
      expect(vitest.getTimerCount()).toBe(1)
      vitest.advanceTimersByTime(2 ** (i + 1) * 100)
      expect(vitest.getTimerCount()).toBe(0)

      await new Promise(process.nextTick)
    }

    expect(setTimeout).toBeCalledTimes(6)
    expect(testFn).toBeCalledTimes(6)
  })

  it('successfully cancels', async () => {
    const testFn = vitest.fn()
    const intervalId = setExponentialInterval(testFn, 20 * 1000)
    clearExponentialInterval(intervalId)
    for (let i = 1; i <= 6; i++) {
      vitest.advanceTimersByTime(2 ** (i + 1) * 100)
      await new Promise(process.nextTick)
    }
    expect(setTimeout).toBeCalledTimes(1)
    expect(testFn).toBeCalledTimes(0)
  })
})
