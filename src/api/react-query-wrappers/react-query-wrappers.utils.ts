import { waitFor } from '@/utils/common.utils'
import { v4 as uuidv4 } from 'uuid'

class ExponentialInterval {
  #action: VoidFunction
  #duration: number

  #isActive = true
  #numRetry = 1
  #totalWaitTime = 0
  #_promise: Promise<void> | undefined

  constructor(action: VoidFunction, duration: number) {
    this.#action = action
    this.#duration = duration

    this.#_promise = this.#start()
  }

  #getTimeoutMs() {
    return 2 ** (this.#numRetry + 1) * 100
  }

  async #start() {
    this.#action()
    while (this.#isActive && this.#totalWaitTime < this.#duration) {
      const timeoutMs = this.#getTimeoutMs()
      this.#totalWaitTime += timeoutMs
      await waitFor(timeoutMs)
      if (!this.#isActive) return
      this.#numRetry += 1
      this.#action()
    }
  }

  cancel() {
    this.#isActive = false
  }
}

const exponentialIntervalInstances = new Map()

export function setExponentialInterval(action: VoidFunction, duration: number) {
  const instanceId = uuidv4()
  const newInstance = new ExponentialInterval(action, duration)
  exponentialIntervalInstances.set(instanceId, newInstance)
  return instanceId
}

export function clearExponentialInterval(instanceId: string | undefined) {
  if (!instanceId) return
  const instance = exponentialIntervalInstances.get(instanceId)

  if (instance) {
    instance.cancel()
    exponentialIntervalInstances.delete(instanceId)
  }
}
