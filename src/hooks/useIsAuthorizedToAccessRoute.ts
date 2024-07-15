import type { RouteIds } from '@tanstack/react-router'
import { type RegisteredRouter, useRouter } from '@tanstack/react-router'
import { useAuthenticatedUser } from './useAuthenticatedUser'

export function useIsAuthorizedToAccessRoute({
  routeId,
}: {
  routeId: RouteIds<RegisteredRouter['routeTree']>
}) {
  const pathAuthLevels = useRouter().routesById[routeId]?.options.staticData?.authLevels

  if (!pathAuthLevels) {
    console.warn(`Route ${routeId} does not have any auth levels defined`)
  }

  const { currentRoles } = useAuthenticatedUser()

  return Boolean(
    pathAuthLevels?.some((requiredAuthLevel) => currentRoles.includes(requiredAuthLevel))
  )
}
