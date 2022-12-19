import { NotFoundError } from '@/utils/errors.utils'
import { useParams } from 'react-router-dom'
import { RouteKey, RouteParams } from '../router.types'
import useCurrentRoute from './useCurrentRoute'
import { getDynamicPathSegments } from '../router.utils'

/**
 * Wrapper for react-router-dom's useParams that performs a runtime check on the actual route params.
 */
function useRouteParams<T extends RouteKey>(): RouteParams<T> {
  const { routeKey } = useCurrentRoute()
  const params = useParams()

  const dynamicPathNames = getDynamicPathSegments(routeKey)

  if (!dynamicPathNames.every((dynamicPathName) => dynamicPathName in params)) {
    throw new NotFoundError()
  }

  return params as RouteParams<T>
}

export default useRouteParams
