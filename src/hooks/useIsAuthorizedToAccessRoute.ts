import { jwtQueryOptions } from '@/api/auth'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { RouteIds } from '@tanstack/react-router'
import { type RegisteredRouter, useRouter } from '@tanstack/react-router'

export function useIsAuthorizedToAccessRoute({
  routeId,
}: {
  routeId: RouteIds<RegisteredRouter['routeTree']>
}) {
  const pathAuthLevels = useRouter().routesById[routeId]?.options.staticData?.authLevels

  const {
    data: { currentRoles },
  } = useSuspenseQuery(jwtQueryOptions())

  return Boolean(
    pathAuthLevels?.some((requiredAuthLevel) => currentRoles.includes(requiredAuthLevel))
  )
}
