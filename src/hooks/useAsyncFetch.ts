import { useContext, useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { RequestConfig } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { PartyContext } from '../lib/context'

type Settings = {
  defaultValue?: any
  useEffectDeps?: any[]
}

export const useAsyncFetch = <T>(requestConfig: RequestConfig, settings: Settings) => {
  const { party } = useContext(PartyContext)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T>(settings.defaultValue)
  const [error, setError] = useState<AxiosError<any>>()

  useEffect(() => {
    async function asyncFetchWithLogs() {
      setLoading(true)

      const response = await fetchWithLogs(requestConfig.path, requestConfig.config)

      if (isFetchError(response)) {
        setError(response)
      } else {
        setData(response!.data)
      }

      setLoading(false)
    }

    asyncFetchWithLogs()

    // If the user changes party, fresh data should be fetched
  }, [party, ...(settings.useEffectDeps || [])]) // eslint-disable-line react-hooks/exhaustive-deps

  return { loading, data, error }
}
