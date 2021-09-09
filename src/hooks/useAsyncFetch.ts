import { useContext, useEffect, useState } from 'react'
import identity from 'lodash/identity'
import { AxiosError, AxiosResponse } from 'axios'
import { RequestConfig } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { PartyContext } from '../lib/context'

type Settings<T, U> = {
  defaultValue?: any
  useEffectDeps?: any
  mapFn?: (data: T) => U
}

export const useAsyncFetch = <T, U = T>(
  requestConfig: RequestConfig,
  { defaultValue, useEffectDeps = [], mapFn = identity }: Settings<T, U>
) => {
  const { party } = useContext(PartyContext)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<U>(defaultValue)
  const [error, setError] = useState<AxiosError<any>>()

  useEffect(() => {
    let isMounted = true

    async function asyncFetchWithLogs() {
      setLoading(true)

      const response = await fetchWithLogs(requestConfig.path, requestConfig.config)

      if (isMounted) {
        isFetchError(response)
          ? setError(response as AxiosError)
          : setData(mapFn((response as AxiosResponse).data))

        setLoading(false)
      }
    }

    asyncFetchWithLogs()

    return () => {
      isMounted = false
    }

    // If the user changes party, fresh data should be fetched
  }, [party, ...useEffectDeps]) // eslint-disable-line react-hooks/exhaustive-deps

  return { loading, data, error }
}
