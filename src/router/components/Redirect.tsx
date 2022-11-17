import React from 'react'
import useNavigateRouter from '../hooks/useNavigateRouter'
import { RouteKey, RouteParams } from '../types'

type RedirectProps<T extends RouteKey> = { to?: T } & (RouteParams<T> extends undefined
  ? { params?: undefined }
  : { params: RouteParams<T> })

const Redirect = <T extends RouteKey>({ to, params }: RedirectProps<T>) => {
  const { navigate } = useNavigateRouter()
  React.useEffect(() => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    if (params) {
      // @ts-ignore
      navigate(to, { params })
    } else {
      // @ts-ignore
      navigate(to)
    }
  }, [params, to, navigate])

  return null
}

export default Redirect
