import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useNavigateRouter from '../hooks/useNavigateRouter'
import { RouteKey, RouteParams } from '../types'

type RedirectProps<T extends RouteKey> = { to?: T } & (RouteParams<T> extends undefined
  ? { params?: undefined }
  : { params: RouteParams<T> })

const Redirect = <T extends RouteKey>({ to, params }: RedirectProps<T>) => {
  const { getRouteUrl } = useNavigateRouter()
  const navigate = useNavigate()
  const location = useLocation()
  React.useEffect(() => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    let routeUrl = params ? getRouteUrl(to, { params }) : getRouteUrl(to)
    routeUrl = `${routeUrl}${location.hash}${location.search}`

    navigate(routeUrl, { replace: true })
  }, [params, to, navigate, location.hash, location.search, getRouteUrl])

  return null
}

export default Redirect
