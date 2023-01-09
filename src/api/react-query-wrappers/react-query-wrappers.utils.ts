import { logger, waitFor } from '@/utils/common.utils'

export class ExponentialBackoffTimeout {
  #action: VoidFunction
  #maxRetries: number

  #isActive = true
  #numRetry = 1
  #_promise: Promise<void> | undefined

  constructor(action: VoidFunction, maxRetries: number) {
    this.#action = action
    this.#maxRetries = maxRetries

    this.#_promise = this.#start()
  }

  #getTimeoutMs() {
    return 2 ** (this.#numRetry + 1) * 100
  }

  async #start() {
    this.#action()
    while (this.#isActive && this.#numRetry <= this.#maxRetries) {
      const timeoutMs = this.#getTimeoutMs()
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
  }

  cancel() {
    logger.info('Polling cancelled.')
    this.#isActive = false
  }
}
