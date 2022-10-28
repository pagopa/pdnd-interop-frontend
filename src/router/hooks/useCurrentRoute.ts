import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useJwt } from '@/hooks/useJwt'
import { useLocation } from 'react-router-dom'
import { routes } from '../routes'
import { getRouteKeyFromPathname, isProviderOrSubscriberRoute } from '../utils'
import intersectionWith from 'lodash/intersectionWith'

/** Returns the route informations of the current location */
function useCurrentRoute() {
  const location = useLocation()
  const currentLanguage = useCurrentLanguage()
  const { currentRoles } = useJwt()

  const routeKey = getRouteKeyFromPathname(location.pathname, currentLanguage)
  const route = routes[routeKey]

  const hasOverlappingRole = intersectionWith(currentRoles, route.AUTH_LEVELS)
  const isUserAuthorized = !route.PUBLIC || route.AUTH_LEVELS === 'any' || hasOverlappingRole
  const mode = isProviderOrSubscriberRoute(routeKey)

  return { routeKey, route, isUserAuthorized, mode }
}

export default useCurrentRoute
