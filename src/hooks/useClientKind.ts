import type { ClientKind } from '@/api/api.generatedTypes'
import { useLocation } from 'react-router-dom'

/**
 * Returns the client kind based on the current route
 * @returns
 * - `API` is returned if we are in the `interop-m2m` sub-route
 * - `CONSUMER` is returned if we are in the `client` sub-route
 *
 */
export function useClientKind(): ClientKind {
  const { pathname } = useLocation()

  if (pathname.includes('interop-m2m')) {
    return 'API'
  }

  if (pathname.includes('client')) {
    return 'CONSUMER'
  }

  throw new Error('useClientKind has been called outside client routes')
}
