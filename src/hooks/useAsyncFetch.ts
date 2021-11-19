import { useContext, useEffect, useState } from 'react'
import identity from 'lodash/identity'
import { AxiosError, AxiosResponse } from 'axios'
import { LoaderType, RequestConfig } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { LoaderContext, PartyContext } from '../lib/context'

type Settings<T, U> = {
  defaultValue?: any
  useEffectDeps?: unknown[]
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
  const [error, setError] = useState<AxiosError>()
  const [isBeforeMount, setIsBeforeMount] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function asyncFetchWithLogs() {
      const setLoadingText =
        loaderType === 'global' ? setGlobalLoadingText : setContextualLoadingText
      setLoadingText(loadingTextLabel)

      setIsBeforeMount(false)

      const response = await fetchWithLogs(requestConfig)

      if (isMounted) {
        isFetchError(response)
          ? setError(response as AxiosError)
          : setData(mapFn((response as AxiosResponse).data))

        setLoadingText(null)
      }
    }

    asyncFetchWithLogs()

    return () => {
      isMounted = false
    }

    // If the user changes party, fresh data should be fetched
  }, [party, ...useEffectDeps]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadingText = loaderType === 'global' ? globalLoadingText : contextualLoadingText
  // loadingText is not enough to determine whether the component is loading,
  // because before the component mounts it is impossible to set the loadingText.
  // To account for this lag, the isBeforeMount flag tells whether the request has
  // not started it. The two together give a reliable isItReallyLoading flag
  const isItReallyLoading = Boolean(loadingText) || isBeforeMount
  return { loadingText, data, error, isItReallyLoading }
}
