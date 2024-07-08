import { isProviderOrConsumerRoute } from '../router.utils'
import { useAuthGuard, useLocation } from '..'
import { useMatches } from '@tanstack/react-router'

/** Returns the route informations of the current location */
export function useCurrentRoute() {
  const matches = useMatches()

  console.log({ matches })

  return {
    mode: 'provider',
  }
}
