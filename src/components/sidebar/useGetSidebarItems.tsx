import { SidebarRoutes } from './sidebar.types'

import DnsIcon from '@mui/icons-material/Dns'
import PeopleIcon from '@mui/icons-material/People'
import { CatalogIcon } from '@/assets/CatalogIcon'
import { ConsumerIcon, ProviderIcon } from '@/assets'
import { AuthHooks } from '@/api/auth'
import { TenantHooks } from '@/api/tenant'
import { isTenantCertifier } from '@/utils/tenant.utils'
import React from 'react'
import { RouteKey } from '@/router'
import { routes } from '@/router'

const interopRoutes: SidebarRoutes = [
  {
    rootRouteKey: 'SUBSCRIBE_CATALOG_LIST',
    icon: CatalogIcon,
    children: [],
    divider: true,
  },
  {
    showNotification: false,
    icon: ConsumerIcon,
    label: 'Fruizione',
    rootRouteKey: 'PROVIDE_AGREEMENT_LIST',
    children: [
      { to: 'PROVIDE_AGREEMENT_LIST', label: 'Richieste inoltrate' },
      { to: 'SUBSCRIBE_PURPOSE_LIST', label: 'Finalità inoltrate' },
    ],
    divider: false,
  },
  {
    icon: ProviderIcon,
    label: 'Erogazione',
    rootRouteKey: 'PROVIDE_ESERVICE_LIST',
    hide: false,
    children: [
      { to: 'PROVIDE_ESERVICE_LIST', label: 'I Miei E-service' },
      { to: 'PROVIDE_ESERVICE_TEMPLATE_LIST', label: 'Template E-Service' },
      { to: 'PROVIDE_AGREEMENT_LIST', label: 'Richieste di fruizione' },
      { to: 'PROVIDE_PURPOSE_LIST', label: 'Finalità ricevute' },
    ],
  },
  {
    icon: DnsIcon,
    rootRouteKey: 'PROVIDE_KEYCHAINS_LIST',
    label: 'Gestione del client',
    hide: false,
    children: [
      { to: 'PROVIDE_KEYCHAINS_LIST', label: 'Portachiavi' },
      { to: 'SUBSCRIBE_CLIENT_LIST', label: 'API fruizione' },
      { to: 'SUBSCRIBE_INTEROP_M2M', label: 'API Fruizione Interop' },
      { to: 'SUBSCRIBE_DEBUG_VOUCHER', label: 'Debug client assertion' },
    ],
  },
  {
    icon: PeopleIcon,
    label: 'Il mio ente',
    rootRouteKey: 'PARTY_REGISTRY',
    children: [
      { to: 'PARTY_REGISTRY', label: 'Anagrafica e attributi' },
      {
        to: 'DELEGATIONS',
        hide: false,
        label: 'Gestione delle deleghe',
      },
    ],
  },
]

export function useGetSidebarItems() {
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
