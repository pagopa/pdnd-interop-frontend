import { SidebarRoutes } from './sidebar.types'

import { AuthHooks } from '@/api/auth'
import { TenantHooks } from '@/api/tenant'
import { isTenantCertifier } from '@/utils/tenant.utils'
import React from 'react'
import { RouteKey } from '@/router'
import { routes } from '@/router'

export function useGetSidebarItems(interopRoutes: SidebarRoutes): SidebarRoutes {
  const { currentRoles, isSupport, isOrganizationAllowedToProduce } = AuthHooks.useJwt()

  const { data: tenant } = TenantHooks.useGetActiveUserParty()

  const isCertifier = isTenantCertifier(tenant)

  return React.useMemo(() => {
    /**
     * Checks if the user as the authorization level required to access a given route.
     * The no-IPA organizations cannot access the PROVIDE routes.
     * The no-certifier organizations cannot access the TENANT_CERTIFIER routes.
     * The no-PA organizations cannot access the DELEGATIONS route.
     */
    const isAuthorizedToRoute = (routeKey: RouteKey) => {
      if (!isSupport && !isOrganizationAllowedToProduce && routeKey === 'PROVIDE') return false

      if (!isCertifier && routeKey === 'TENANT_CERTIFIER') return false

      if (!isOrganizationAllowedToProduce && routeKey === 'DELEGATIONS') return false

      const authLevels = routes[routeKey].authLevels
      return authLevels.some((authLevel) => currentRoles.includes(authLevel))
    }

    /**
     * Filters out views that the user is not authorized to access
     */

    return interopRoutes.reduce<SidebarRoutes>((acc, item) => {
      // If the view is not authorized, we don't need to check its children
      if (!isAuthorizedToRoute(item.rootRouteKey)) return acc

      // If the view has children, we need to filter out the ones that the user is not authorized to access
      if ('children' in item) {
        const children = [...item.children!].filter(() => isAuthorizedToRoute(item.rootRouteKey))

        return [...acc, { ...item, children }]
      }
      return [...acc, item]
    }, [])
  }, [currentRoles, isOrganizationAllowedToProduce, isSupport, isCertifier])
}
