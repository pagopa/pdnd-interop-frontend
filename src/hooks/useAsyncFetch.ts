import { useEffect, useState } from 'react'
import { RequestConfig } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'

export const useAsyncFetch = <T>(requestConfig: RequestConfig, dataKey?: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<T[]>([])

  useEffect(() => {
    async function asyncFetchWithLogs() {
      setIsLoading(true)

      const list = await fetchWithLogs(requestConfig.path, requestConfig.config)

      setIsLoading(false)
      setData(dataKey ? list!.data[dataKey] : list!.data)
    }

    asyncFetchWithLogs()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { isLoading, data }
}
