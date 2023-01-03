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
  #promise: Promise<void> | undefined

  constructor(action: VoidFunction, maxRetries: number) {
    this.#action = action
    this.#maxRetries = maxRetries

    this.#promise = this.#start()
  }

  #getTimeoutMs() {
    return 2 ** (this.#numRetry + 1) * 100
  }

  async #start() {
    while (this.#isActive) {
      if (this.#numRetry > this.#maxRetries) break
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
    this.#isActive = false
  }
}

const QueriesPollingContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const timeoutRef = React.useRef<ExponentialBackoffTimeout>()
  const queryClient = useQueryClient()

  const _refetchActiveQueries = React.useCallback(() => {
    queryClient.refetchQueries({ type: 'active' })
  }, [queryClient])

  const _startPolling = React.useCallback(() => {
    timeoutRef.current = new ExponentialBackoffTimeout(_refetchActiveQueries, 8)
  }, [_refetchActiveQueries])

  const requestPolling = React.useCallback(() => {
    timeoutRef.current?.cancel()
    _startPolling()
  }, [_startPolling])

  const value = React.useMemo(() => ({ requestPolling }), [requestPolling])

  return <Provider value={value}>{children}</Provider>
}

export { useQueriesPolling, QueriesPollingContextProvider }
