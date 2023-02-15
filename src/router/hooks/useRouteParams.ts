import { useParams } from 'react-router-dom'
import { RouteKey, RouteParams } from '../router.types'

/**
 * Wrapper for react-router-dom's useParams that return typed params.
 */
function useRouteParams<T extends RouteKey>(): RouteParams<T> {
  const params = useParams()

  return params as RouteParams<T>
}

export default useRouteParams
