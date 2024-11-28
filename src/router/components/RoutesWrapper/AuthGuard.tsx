import { AuthQueries } from '@/api/auth'
import { TenantQueries } from '@/api/tenant'
import type { RouteKey } from '@/router'
import { useAuthGuard, useCurrentRoute } from '@/router'
import type { JwtUser, UserProductRole } from '@/types/party.types'
import { ForbiddenError } from '@/utils/errors.utils'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export interface AuthGuardProps {
  children: React.ReactNode
  jwt?: JwtUser
  currentRoles: UserProductRole[]
  isOrganizationAllowedToProduce: boolean
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
  isOrganizationAllowedToProduce,
  isSupport,
}) => {
  const { isUserAuthorized } = useAuthGuard()
  const { mode, routeKey } = useCurrentRoute()
  const { data: blacklist } = useQuery(AuthQueries.getBlacklist())
  const { data: tenant } = useQuery({
    ...TenantQueries.getParty(jwt!.organizationId),
    enabled: Boolean(jwt?.organizationId),
  })

  const isInBlacklist = jwt?.organizationId && blacklist?.includes(jwt.organizationId)

  function isUserAllowedToAccessCertifierRoutes() {
    const isCertifier = Boolean(tenant?.features[0]?.certifier?.certifierId)
    const certifierRoutes: Array<RouteKey> = [
      'TENANT_CERTIFIER',
      'TENANT_CERTIFIER_ATTRIBUTE_DETAILS',
    ]
    // The user can watch certifier's routes only if he is certifier
    return isCertifier || !certifierRoutes.includes(routeKey)
  }

  function isUserAllowedToAccessRoute() {
    // IsUserAuthorized method check if is user with specific role has the right to see certain page
    // or if the route is public.
    const isAuthorized = isUserAuthorized(currentRoles)
    const isInProvidersRoutes = mode === 'provider'
    // If the user is in a provider route, he can access it if he is a support or if he is in an IPA organization
    const canAccessProviderRoutes = isOrganizationAllowedToProduce || isSupport

    return isAuthorized && !isInBlacklist && !(isInProvidersRoutes && !canAccessProviderRoutes)
  }
  // JWT will be undefined just in case route is public.
  if (jwt && (!isUserAllowedToAccessRoute() || !isUserAllowedToAccessCertifierRoutes())) {
    throw new ForbiddenError()
  }

  return <>{children}</>
}
