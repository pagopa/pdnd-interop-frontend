import { isProviderOrConsumerRoute } from '../router.utils'
import { useAuthGuard, useLocation } from '..'

/** Returns the route informations of the current location */
export function useCurrentRoute() {
  const { isPublic } = useAuthGuard()
  const { pathname, routeKey } = useLocation()

  return {
    routeKey,
    isPublic,
    mode: isProviderOrConsumerRoute(pathname),
  }
}
