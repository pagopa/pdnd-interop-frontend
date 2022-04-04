import { useContext, useEffect, useState } from 'react'
import identity from 'lodash/identity'
import { AxiosError, AxiosResponse } from 'axios'
import { RequestConfig } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { PartyContext } from '../lib/context'

type Settings<T, U> = {
  useEffectDeps?: Array<unknown>
  mapFn?: (data: T) => U
}

export const useAsyncFetch = <T, U = T>(
  requestConfig: RequestConfig,
  settings?: Settings<T, U>
) => {
  const useEffectDeps = (settings && settings.useEffectDeps) || []
  const mapFn = (settings && settings.mapFn) || identity

  const { party } = useContext(PartyContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<U | undefined>()
  const [error, setError] = useState<AxiosError>()

  useEffect(() => {
    let isMounted = true

    async function asyncFetchWithLogs() {
      setIsLoading(true)

      const response = await fetchWithLogs(requestConfig)

      if (isMounted) {
        isFetchError(response)
          ? setError(response as AxiosError)
          : setData(mapFn((response as AxiosResponse).data))

        setIsLoading(false)
      }
    }

    asyncFetchWithLogs()

    return () => {
      isMounted = false
    }

    // If the user changes party, fresh data should be fetched
  }, [party, ...useEffectDeps]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, error, isLoading: isLoading }
}
