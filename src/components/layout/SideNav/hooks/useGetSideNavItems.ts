import React from 'react'
import type { SideNavItemView } from '../SideNav'
import EmailIcon from '@mui/icons-material/Email'
import type { RouteKey } from '@/router'
import { routes } from '@/router'
import { AuthHooks } from '@/api/auth'

const views = [
  {
    routeKey: 'PROVIDE',
    id: 'provider',
    children: ['PROVIDE_ESERVICE_LIST', 'PROVIDE_AGREEMENT_LIST', 'PROVIDE_PURPOSE_LIST'],
  },
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
  { routeKey: 'NOTIFICATION', StartIcon: EmailIcon },
  { routeKey: 'PARTY_REGISTRY' },
] as const

export function useGetSideNavItems() {
  const { currentRoles, isIPAOrganization } = AuthHooks.useJwt()

  return React.useMemo(() => {
    /**
     * Checks if the user as the authorization level required to access a given route.
     * The no-IPA organizations cannot access the PROVIDE routes.
     */
    const isAuthorizedToRoute = (routeKey: RouteKey) => {
      if (!isIPAOrganization && routeKey === 'PROVIDE') return false

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
  }, [currentRoles, isIPAOrganization])
}
