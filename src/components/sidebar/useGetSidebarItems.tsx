import type { SidebarRoutes } from './sidebar.types'

import { AuthHooks } from '@/api/auth'
import { TenantHooks } from '@/api/tenant'
import { isTenantCertifier } from '@/utils/tenant.utils'
import React from 'react'
import type { RouteKey } from '@/router'
import { routes } from '@/router'
import DnsIcon from '@mui/icons-material/Dns'
import { ConsumerIcon, ProviderIcon, CatalogIcon, DeveloperToolIcon, MyTenantIcon } from '@/icons'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useTranslation } from 'react-i18next'
import { FEATURE_FLAG_NOTIFICATION_CONFIG } from '@/config/env'

export function useGetSidebarItems(): SidebarRoutes {
  const { t } = useTranslation('sidebar', { keyPrefix: 'menuItem' })
  const { currentRoles, isSupport, isOrganizationAllowedToProduce } = AuthHooks.useJwt()

  const { data: tenant } = TenantHooks.useGetActiveUserParty()

  return React.useMemo(() => {
    const interopRoutes: SidebarRoutes = [
      {
        rootRouteKey: 'SUBSCRIBE_CATALOG_LIST',
        icon: CatalogIcon,
        label: t('eserviceCatalog'),
        children: [],
      },
      {
        icon: NotificationsIcon,
        rootRouteKey: 'NOTIFICATIONS',
        label: 'Notifiche ',
        children: [],
        divider: true,
        hide: !FEATURE_FLAG_NOTIFICATION_CONFIG,
      },
      {
        showNotification: false,
        icon: ConsumerIcon,
        label: t('subscribe.subscribe'),
        rootRouteKey: 'SUBSCRIBE_AGREEMENT_LIST',
        children: [
          { to: 'SUBSCRIBE_AGREEMENT_LIST', label: t('subscribe.agreement') },
          { to: 'SUBSCRIBE_PURPOSE_LIST', label: t('subscribe.purpose') },
          {
            to: 'SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG',
            label: t('subscribe.purposeTemplateCatalog'),
          },
          { to: 'SUBSCRIBE_PURPOSE_TEMPLATE_LIST', label: t('subscribe.purposeTemplate') },
        ],
        divider: false,
      },
      {
        icon: ProviderIcon,
        label: t('provider.provider'),
        rootRouteKey: 'PROVIDE_ESERVICE_LIST',
        hide: !isSupport && !isOrganizationAllowedToProduce,
        children: [
          { to: 'PROVIDE_ESERVICE_LIST', label: t('provider.providerEservice') },
          { to: 'PROVIDE_AGREEMENT_LIST', label: t('provider.providerAgreeemnt') },
          { to: 'PROVIDE_PURPOSE_LIST', label: t('provider.providerPurpose') },
          {
            to: 'PROVIDE_ESERVICE_TEMPLATE_CATALOG',
            label: t('provider.eServiceTemplatesCatalog'),
          },
          { to: 'PROVIDE_ESERVICE_TEMPLATE_LIST', label: t('provider.providerEserviceTemplate') },
          { to: 'PROVIDE_KEYCHAINS_LIST', label: t('provider.providerKeychainsList') },
        ],
      },
      {
        icon: DnsIcon,
        rootRouteKey: 'SUBSCRIBE_CLIENT_LIST',
        label: t('client.client'),
        hide: false,
        children: [
          { to: 'SUBSCRIBE_CLIENT_LIST', label: t('client.eservice') },
          { to: 'SUBSCRIBE_INTEROP_M2M', label: t('client.interop') },
        ],
      },
      {
        icon: MyTenantIcon,
        label: t('tenant.tenant'),
        rootRouteKey: 'PARTY_REGISTRY',
        children: [
          { to: 'PARTY_REGISTRY', label: t('tenant.partyRegistry') },
          {
            to: 'TENANT_CERTIFIER',
            hide: !isTenantCertifier(tenant),
            label: t('tenant.tenantCertifier'),
          },
          {
            to: 'DELEGATIONS',
            hide: !isOrganizationAllowedToProduce,
            label: t('tenant.delegations'),
          },
        ],
      },
      {
        icon: DeveloperToolIcon,
        rootRouteKey: 'DEVELOPER_TOOLS',
        label: 'Tool per lo sviluppo',
        children: [],
      },
    ]

    const userHasRouteRoles = (routeKey: RouteKey) => {
      const authLevels = routes[routeKey].authLevels
      return authLevels.some((authLevel) => currentRoles.includes(authLevel))
    }

    return interopRoutes.reduce<SidebarRoutes>((acc, item) => {
      // If the view is not authorized, we don't need to check its children
      if (!userHasRouteRoles(item.rootRouteKey)) return acc

      // If the view has children, we need to filter out the ones that the user is not authorized to access
      if ('children' in item) {
        const children = [...item.children!].filter((child) => userHasRouteRoles(child.to))

        return [...acc, { ...item, children }]
      }
      return [...acc, item]
    }, [])
  }, [currentRoles, isOrganizationAllowedToProduce, isSupport, t, tenant])
}
