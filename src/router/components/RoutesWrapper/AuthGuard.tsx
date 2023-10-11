import { AuthHooks } from '@/api/auth'
import { useAuthGuard, useCurrentRoute } from '@/router'
import type { JwtUser, UserProductRole } from '@/types/party.types'
import { ForbiddenError } from '@/utils/errors.utils'
import React from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  jwt?: JwtUser
  currentRoles: UserProductRole[]
  isIPAOrganization: boolean
  isSupport: boolean
}

/**
 * This component is used to check if the user is authorized to access the route.
 * If the user is not authorized, it will throw an error.
 *
 * The authorization is based on the user roles set in the JWT and the roles set in the route.
 * If the user has at least one role in common with the route, he is authorized.
 *
 * The blacklist is used to prevent access to the application for a specific organization.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  jwt,
  currentRoles,
  isIPAOrganization,
  isSupport,
}) => {
  const { isUserAuthorized } = useAuthGuard()
  const { mode } = useCurrentRoute()
  const { data: blacklist } = AuthHooks.useGetBlacklist()

  const isInBlacklist = jwt?.organizationId && blacklist?.includes(jwt.organizationId)

  function isUserAllowedToAccessRoute() {
    const isAuthorized = isUserAuthorized(currentRoles)
    const isInProvidersRoutes = mode === 'provider'
    // If the user is in a provider route, he can access it if he is a support or if he is in an IPA organization
    const canAccessProviderRoutes = isIPAOrganization || isSupport

    return isAuthorized && !isInBlacklist && !(isInProvidersRoutes && !canAccessProviderRoutes)
  }

  if (jwt && !isUserAllowedToAccessRoute()) {
    throw new ForbiddenError()
  }

  return <>{children}</>
}
