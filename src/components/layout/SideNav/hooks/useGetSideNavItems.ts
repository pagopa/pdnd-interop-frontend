import React from 'react'
import type { SideNavItemView } from '../SideNav'
import type { RouteKey } from '@/router'
import { routes } from '@/router'
import { AuthHooks } from '@/api/auth'
import { TenantHooks } from '@/api/tenant'

const views = [
  {
    routeKey: 'SUBSCRIBE',
    id: 'subscriber',
    children: [
      'SUBSCRIBE_CATALOG_LIST',
      'SUBSCRIBE_AGREEMENT_LIST',
      'SUBSCRIBE_PURPOSE_LIST',
      'SUBSCRIBE_CLIENT_LIST',
      'SUBSCRIBE_INTEROP_M2M',
      'SUBSCRIBE_DEBUG_VOUCHER',
    ],
  },
  {
    routeKey: 'PROVIDE',
    id: 'provider',
    children: [
      'PROVIDE_ESERVICE_LIST',
      'PROVIDE_AGREEMENT_LIST',
      'PROVIDE_PURPOSE_LIST',
      'PROVIDE_KEYCHAINS_LIST',
    ],
  },
  {
    routeKey: 'TENANT',
    id: 'tenant',
    children: ['PARTY_REGISTRY', 'TENANT_CERTIFIER', 'DELEGATIONS'],
  },
] as const

export function useGetSideNavItems() {
  const { currentRoles, isSupport, isOrganizationAllowedToProduce } = AuthHooks.useJwt()

  const { data: tenant } = TenantHooks.useGetActiveUserParty()

  const isCertifier = tenant.features.some(
    (feature) => 'certifier' in feature && feature.certifier?.certifierId
  )

  return React.useMemo(() => {
    /**
     * Checks if the user as the authorization level required to access a given route.
     * The no-IPA organizations cannot access the PROVIDE routes.
     * The no-certifier organizations cannot access the TENANT_CERTIFIER routes.
     */
    const isAuthorizedToRoute = (routeKey: RouteKey) => {
      if (!isSupport && !isOrganizationAllowedToProduce && routeKey === 'PROVIDE') return false

      if (!isCertifier && routeKey === 'TENANT_CERTIFIER') return false

      const authLevels = routes[routeKey].authLevels
      return authLevels.some((authLevel) => currentRoles.includes(authLevel))
    }

    /**
     * Filters out views that the user is not authorized to access
     */
    return views.reduce<Array<SideNavItemView>>((acc, view) => {
      // If the view is not authorized, we don't need to check its children
      if (!isAuthorizedToRoute(view.routeKey)) return acc

      // If the view has children, we need to filter out the ones that the user is not authorized to access
      if ('children' in view) {
        const children = [...view.children].filter(isAuthorizedToRoute)
        if (children.length === 0) return acc

        return [...acc, { ...view, children }]
      }

      return [...acc, view]
    }, [])
  }, [currentRoles, isOrganizationAllowedToProduce, isSupport, isCertifier])
}
