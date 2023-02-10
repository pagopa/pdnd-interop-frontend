import React from 'react'
import { useJwt } from '@/hooks/useJwt'
import { SideNavItemView } from '../SideNav'
import { UserProductRole } from '@/types/party.types'
import EmailIcon from '@mui/icons-material/Email'
import { RouteKey } from '@/router/router.types'
import uniq from 'lodash/uniq'

type Views = Record<UserProductRole, Array<SideNavItemView>>

const views: Views = {
  admin: [
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
      ],
    },
  ],
  api: [
    {
      routeKey: 'PROVIDE',
      id: 'provider',
      children: ['PROVIDE_ESERVICE_LIST'],
    },
    {
      routeKey: 'SUBSCRIBE',
      id: 'subscriber',
      children: ['SUBSCRIBE_CATALOG_LIST'],
    },
  ],
  security: [
    {
      routeKey: 'SUBSCRIBE',
      id: 'subscriber',
      children: ['SUBSCRIBE_CATALOG_LIST', 'SUBSCRIBE_CLIENT_LIST', 'SUBSCRIBE_INTEROP_M2M'],
    },
  ],
}

export function useGetSideNavItems() {
  const { currentRoles } = useJwt()

  return React.useMemo(() => {
    const availableSideNavItems: Array<SideNavItemView> = []

    // For each user roles
    currentRoles.forEach((userRole) => {
      // ... take all the sidenav items for that role...
      const roleSideNavItems = views[userRole]

      roleSideNavItems.forEach(({ id: roleSideNavItemId, children }, index) => {
        const sideNavBarItemIndex = availableSideNavItems.findIndex(
          ({ id }) => id === roleSideNavItemId
        )

        // ... if the item is already on the availableSideNavItems array, just merge the children
        if (sideNavBarItemIndex > -1) {
          availableSideNavItems[sideNavBarItemIndex].children?.push(...(children ?? []))
        }

        // ... if not add the side nav item inside the availableSideNavItems array result.
        if (sideNavBarItemIndex === -1) {
          availableSideNavItems.push(roleSideNavItems[index])
        }
      })
    })

    availableSideNavItems.push({ routeKey: 'NOTIFICATION', StartIcon: EmailIcon })

    if (currentRoles.includes('admin')) {
      availableSideNavItems.push({ routeKey: 'PARTY_REGISTRY' as RouteKey })
    }

    // Remove duplicated children, if there's any.
    availableSideNavItems.forEach((_, index) => {
      if (availableSideNavItems[index]?.children) {
        availableSideNavItems[index].children = uniq(availableSideNavItems[index].children)
      }
    })

    return availableSideNavItems
  }, [currentRoles])
}
