import React from 'react'
import noop from 'lodash/noop'
import { createSafeContext } from './utils'

const TIMEOUT_STOP_POLLING_AFTER_SECONDS = 5

type QueriesPollingContextType = {
  isPollingActive: boolean
  requestPolling: () => void
}

const { useContext: useQueriesPolling, Provider } = createSafeContext<QueriesPollingContextType>(
  'QueriesPollingContext',
  { isPollingActive: false, requestPolling: noop }
)

const QueriesPollingContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPollingActive, setIsPollingActive] = React.useState(false)
  const pollingTimeout = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    return () => clearTimeout(pollingTimeout.current)
  }, [])

  const _startPolling = React.useCallback(() => {
    setIsPollingActive(true)
  }, [])

  const _stopPolling = React.useCallback(() => {
    setIsPollingActive(false)
  }, [])

  const requestPolling = React.useCallback(() => {
    clearTimeout(pollingTimeout.current)

    _startPolling()

    pollingTimeout.current = setTimeout(_stopPolling, TIMEOUT_STOP_POLLING_AFTER_SECONDS * 1000)
  }, [_startPolling, _stopPolling])

  const value = React.useMemo(
    () => ({ isPollingActive, requestPolling }),
    [isPollingActive, requestPolling]
  )

  return <Provider value={value}>{children}</Provider>
}

export { useQueriesPolling, QueriesPollingContextProvider }
