import type { RouteIds } from '@tanstack/react-router'
import { type RegisteredRouter, useRouter } from '@tanstack/react-router'
import { useAuthenticatedUser } from './useAuthenticatedUser'

export function useIsAuthorizedToAccessRoute({
  routeId,
}: {
  routeId: RouteIds<RegisteredRouter['routeTree']>
}) {
  const pathAuthLevels = useRouter().routesById[routeId]?.options.staticData?.authLevels

  const { currentRoles } = useAuthenticatedUser()

  return Boolean(
    pathAuthLevels?.some((requiredAuthLevel) => currentRoles.includes(requiredAuthLevel))
  )
}
