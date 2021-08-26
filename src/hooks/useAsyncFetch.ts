import { useEffect, useState } from 'react'
import { RequestConfig } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'

export const useAsyncFetch = <T>(
  requestConfig: RequestConfig,
  defaultValue: any,
  dataKey?: string
) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T>(defaultValue)

  useEffect(() => {
    async function asyncFetchWithLogs() {
      setLoading(true)

      const list = await fetchWithLogs(requestConfig.path, requestConfig.config)

      setLoading(false)
      setData(dataKey ? list!.data[dataKey] : list!.data)
    }

    asyncFetchWithLogs()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { loading, data }
}
