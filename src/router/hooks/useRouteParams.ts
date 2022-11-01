import { NotFoundError } from '@/utils/errors.utils'
import memoize from 'lodash/memoize'
import identity from 'lodash/identity'
import { useParams } from 'react-router-dom'
import { RouteKey, RouteParams } from '../types'
import useCurrentRoute from './useCurrentRoute'
import { routes } from '../routes'

const getUrlParams = memoize((routeKey: RouteKey) => {
  return routes[routeKey].PATH.it
    .split('/')
    .filter(identity)
    .filter((subpath) => subpath.startsWith(':'))
    .map((param) => param.replace(':', ''))
})

function useRouteParams<T extends RouteKey>(): RouteParams<T> {
  const { routeKey } = useCurrentRoute()
  const params = useParams()

  const urlParams = getUrlParams(routeKey)

  if (!urlParams.every((urlParam) => urlParam in params)) {
    throw new NotFoundError()
  }

  return params as RouteParams<T>
}

export default useRouteParams
