import { logger, waitFor } from '@/utils/common.utils'

export class ExponentialBackoffTimeout {
  #action: VoidFunction
  #maxTimeout: number

  #isActive = true
  #numRetry = 1
  #totalWaitTime = 0
  #_promise: Promise<void> | undefined

  constructor(action: VoidFunction, maxTimeout: number) {
    this.#action = action
    this.#maxTimeout = maxTimeout

    this.#_promise = this.#start()
  }

  #getTimeoutMs() {
    return 2 ** (this.#numRetry + 1) * 100
  }

  async #start() {
    this.#action()
    while (this.#isActive && this.#totalWaitTime < this.#maxTimeout) {
      const timeoutMs = this.#getTimeoutMs()
      this.#totalWaitTime += timeoutMs
      logger.info(
        `Polling active queries...\n\nNum: ${
          this.#numRetry
        }\nWaiting ${timeoutMs}ms before refetching...`
      )
      await waitFor(timeoutMs)
      if (!this.#isActive) return
      this.#numRetry += 1
      this.#action()
    }
    logger.info('Polling ended.')
  }

  cancel() {
    logger.info('Polling cancelled.')
    this.#isActive = false
  }
}
