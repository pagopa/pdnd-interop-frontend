import React from 'react'
import { jwtQueryOptions } from '@/api/auth'
import { ForbiddenError } from '@/utils/errors.utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useMatches, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authentication-guard/_tos-guard/_app-layout/_authorization-guard'
)({
  component: AuthorizationGuard,
})

export function AuthorizationGuard() {
  const currentAuthLevels = useMatches({ select: (m) => m[m.length - 1].staticData.authLevels })

  const {
    data: { currentRoles },
  } = useSuspenseQuery(jwtQueryOptions())

  const isAuthorizedToAccessRoute = Boolean(
    currentAuthLevels?.some((requiredAuthLevel) => currentRoles.includes(requiredAuthLevel))
  )

  if (!isAuthorizedToAccessRoute) {
    throw new ForbiddenError()
  }

  return <Outlet />
}
