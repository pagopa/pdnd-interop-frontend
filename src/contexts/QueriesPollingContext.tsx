import React from 'react'
import noop from 'lodash/noop'
import { createSafeContext } from './utils'
import { useQueryClient } from '@tanstack/react-query'
import { logger, waitFor } from '@/utils/common.utils'

type QueriesPollingContextType = {
  requestPolling: () => void
}

const { useContext: useQueriesPolling, Provider } = createSafeContext<QueriesPollingContextType>(
  'QueriesPollingContext',
  { requestPolling: noop }
)

class ExponentialBackoffTimeout {
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

const QueriesPollingContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const exponentialBackoffTimeoutRef = React.useRef<ExponentialBackoffTimeout>()
  const queryClient = useQueryClient()

  const requestPolling = React.useCallback(() => {
    const refetchActiveQueries = () => {
      queryClient.refetchQueries({ type: 'active' })
    }

    exponentialBackoffTimeoutRef.current?.cancel()
    exponentialBackoffTimeoutRef.current = new ExponentialBackoffTimeout(refetchActiveQueries, 8)
  }, [queryClient])

  const value = React.useMemo(() => ({ requestPolling }), [requestPolling])

  return <Provider value={value}>{children}</Provider>
}

export { useQueriesPolling, QueriesPollingContextProvider }
