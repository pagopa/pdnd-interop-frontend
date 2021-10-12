import { useContext, useEffect, useState } from 'react'
import identity from 'lodash/identity'
import { AxiosError, AxiosResponse } from 'axios'
import { LoaderType, RequestConfig } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { LoaderContext, PartyContext } from '../lib/context'

type Settings<T, U> = {
  defaultValue?: any
  useEffectDeps?: any
  mapFn?: (data: T) => U
  loaderType?: LoaderType
  loadingTextLabel: string
}

export const useAsyncFetch = <T, U = T>(
  requestConfig: RequestConfig,
  {
    defaultValue,
    loaderType = 'global',
    loadingTextLabel,
    useEffectDeps = [],
    mapFn = identity,
  }: Settings<T, U>
) => {
  const { party } = useContext(PartyContext)
  const { loadingText: globalLoadingText, setLoadingText: setGlobalLoadingText } =
    useContext(LoaderContext)
  const [contextualLoadingText, setContextualLoadingText] = useState<string | null>(null)
  const [data, setData] = useState<U>(defaultValue)
  const [error, setError] = useState<AxiosError<any>>()

  useEffect(() => {
    let isMounted = true

    async function asyncFetchWithLogs() {
      const setLoadingText =
        loaderType === 'global' ? setGlobalLoadingText : setContextualLoadingText
      setLoadingText(loadingTextLabel)

      const response = await fetchWithLogs(requestConfig)

      if (isMounted) {
        isFetchError(response)
          ? setError(response as AxiosError<any>)
          : setData(mapFn((response as AxiosResponse<any>).data))

        setLoadingText(null)
      }
    }

    // There may be a lag in retrieving the party, but most requests make use of it
    // So make sure you have it before fetching data
    if (party !== null) {
      asyncFetchWithLogs()
    }

    return () => {
      isMounted = false
    }

    // If the user changes party, fresh data should be fetched
  }, [party, ...useEffectDeps]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    loadingText: loaderType === 'global' ? globalLoadingText : contextualLoadingText,
    data,
    error,
  }
}
