import { useContext, useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { RequestConfig } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { PartyContext } from '../lib/context'

export const useAsyncFetch = <T>(
  requestConfig: RequestConfig,
  defaultValue: any,
  dataKey?: string
) => {
  const { party } = useContext(PartyContext)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T>(defaultValue)
  const [error, setError] = useState<AxiosError<any>>()

  useEffect(() => {
    async function asyncFetchWithLogs() {
      setLoading(true)

      const response = await fetchWithLogs(requestConfig.path, requestConfig.config)

      if (isFetchError(response)) {
        setError(response)
      } else {
        setData(dataKey ? response!.data[dataKey] : response!.data)
      }

      setLoading(false)
    }

    asyncFetchWithLogs()

    // If the user changes party, fresh data should be fetched
  }, [party]) // eslint-disable-line react-hooks/exhaustive-deps

  return { loading, data, error }
}
