import { type RouteKey, getParentRoutes, useCurrentRoute } from '@/router'

export function useIsRouteInCurrentSubtree() {
  const { routeKey: currentRouteKey } = useCurrentRoute()
  return (routeKey: RouteKey) => {
    return [...getParentRoutes(currentRouteKey), currentRouteKey].includes(routeKey)
  }
}
