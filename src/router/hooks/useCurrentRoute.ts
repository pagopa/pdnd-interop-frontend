import { useJwt } from '@/hooks/useJwt'
import { isEditPath, isProviderOrConsumerRoute } from '../router.utils'
import { useAuthGuard, useLocation } from '..'

/** Returns the route informations of the current location */
export function useCurrentRoute() {
  const { isPublic, isUserAuthorized } = useAuthGuard()
  const { pathname, routeKey } = useLocation()
  const { currentRoles } = useJwt()

  return {
    routeKey,
    isPublic,
    isUserAuthorized: isUserAuthorized(currentRoles),
    mode: isProviderOrConsumerRoute(pathname),
    isEditPath: isEditPath(pathname),
  }
}
