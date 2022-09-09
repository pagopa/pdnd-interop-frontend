import { useContext, useEffect, useState } from 'react'
import identity from 'lodash/identity'
import { AxiosError, AxiosResponse } from 'axios'
import { RequestConfig } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { useJwt } from './useJwt'
import { DialogContext } from '../lib/context'

type Settings<T, U> = {
  useEffectDeps?: Array<unknown>
  mapFn?: (data: T) => U
}

export const useAsyncFetch = <T, U = T>(
  requestConfig: RequestConfig,
  settings?: Settings<T, U>
) => {
  const { jwt, hasSessionExpired } = useJwt()
  const { setDialog } = useContext(DialogContext)
  const useEffectDeps = (settings && settings.useEffectDeps) || []
  const mapFn = (settings && settings.mapFn) || identity

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<U | undefined>()
  const [error, setError] = useState<AxiosError>()

  useEffect(() => {
    let isMounted = true

    async function asyncFetchWithLogs() {
      setIsLoading(true)

      const response = await fetchWithLogs(requestConfig)

      // This is just to shut React up
      if (!isMounted) {
        return
      }

      // If all is ok, store the data
      if (!isFetchError(response)) {
        setData(mapFn((response as AxiosResponse).data))
        setIsLoading(false)
        return
      }

      // Otherwise, it means something went wrong
      // If the session has expired, force log out
      if (hasSessionExpired) {
        setDialog({ type: 'sessionExpired' })
      } else {
        setError(response as AxiosError)
      }

      setIsLoading(false)
    }

    if (jwt) {
      asyncFetchWithLogs()
    }

    return () => {
      isMounted = false
    }
  }, [jwt, ...useEffectDeps]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, error, isLoading }
}
