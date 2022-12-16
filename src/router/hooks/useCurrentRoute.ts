import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useJwt } from '@/hooks/useJwt'
import { useLocation } from 'react-router-dom'
import { routes } from '../routes'
import {
  getParentRoutes,
  getRouteKeyFromPath,
  isEditPath as _isEditPath,
  isProviderOrConsumerRoute,
} from '../router.utils'
import { RouteKey } from '../router.types'
import React from 'react'

/** Returns the route informations of the current location */
function useCurrentRoute() {
  const location = useLocation()
  const currentLanguage = useCurrentLanguage()
  const { currentRoles } = useJwt()

  const routeKey = getRouteKeyFromPath(location.pathname, currentLanguage)
  const route = routes[routeKey]
  const hasOverlappingRole =
    route.AUTH_LEVELS === 'any' ||
    currentRoles.some((role) => route.AUTH_LEVELS.includes(role as typeof route.AUTH_LEVELS[0]))
  const isPublic = route.PUBLIC
  const isUserAuthorized = isPublic || hasOverlappingRole
  const mode = isProviderOrConsumerRoute(routeKey)
  const isEditPath = _isEditPath(routeKey)

  const isRouteInCurrentSubtree = React.useCallback(
    (route: RouteKey) => {
      return [...getParentRoutes(routeKey), routeKey].includes(route)
    },
    [routeKey]
  )

  return { routeKey, route, isUserAuthorized, mode, isPublic, isEditPath, isRouteInCurrentSubtree }
}

export default useCurrentRoute
