import React from 'react'
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'
import type { SxProps } from '@mui/material'
import type { SidebarRoutes } from '../sidebar/sidebar.types'
import { Sidebar } from '../sidebar/Sidebar'
import { useGetSidebarItems } from '../sidebar/useGetSidebarItems'
import DnsIcon from '@mui/icons-material/Dns'
import { CatalogIcon } from '@/assets/CatalogIcon'
import { ConsumerIcon, ProviderIcon } from '@/assets'
import { DeveloperToolIcon } from '@/assets/DeveloperToolIcon'
import { MyTenantIcon } from '@/assets/MyTenantIcon'
import { useTranslation } from 'react-i18next'
type AppLayoutProps = {
  children: React.ReactNode
  hideSideNav?: boolean
  sx?: SxProps
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, hideSideNav, sx }) => {
  const { t } = useTranslation('sidebar', { keyPrefix: 'menuItem' })

  const INTEROP_NAVIGATION_ROUTES: SidebarRoutes = [
    {
      rootRouteKey: 'SUBSCRIBE_CATALOG_LIST',
      icon: CatalogIcon,
      label: t('eserviceCatalog'),
      children: [],
      divider: true,
    },
    {
      showNotification: false,
      icon: ConsumerIcon,
      label: t('subscribe.subscribe'),
      rootRouteKey: 'PROVIDE_AGREEMENT_LIST',
      children: [
        { to: 'SUBSCRIBE_AGREEMENT_LIST', label: t('subscribe.agreement') },
        { to: 'SUBSCRIBE_PURPOSE_LIST', label: t('subscribe.purpose') },
      ],
      divider: false,
    },
    {
      icon: ProviderIcon,
      label: t('provider.provider'),
      rootRouteKey: 'PROVIDE_ESERVICE_LIST',
      hide: false,
      children: [
        { to: 'PROVIDE_ESERVICE_LIST', label: t('provider.providerEservice') },
        { to: 'PROVIDE_AGREEMENT_LIST', label: t('provider.providerAgreeemnt') },
        { to: 'PROVIDE_PURPOSE_LIST', label: t('provider.providerPurpose') },
        { to: 'PROVIDE_ESERVICE_TEMPLATE_CATALOG', label: t('provider.eServiceTemplatesCatalog') },
        { to: 'PROVIDE_ESERVICE_TEMPLATE_LIST', label: t('provider.providerEserviceTemplate') },
        { to: 'PROVIDE_KEYCHAINS_LIST', label: t('provider.providerKeychainsList') },
      ],
    },
    {
      icon: DnsIcon,
      rootRouteKey: 'PROVIDE_KEYCHAINS_LIST',
      label: t('client.client'),
      hide: false,
      children: [
        { to: 'SUBSCRIBE_CLIENT_LIST', label: t('client.eservice') },
        { to: 'SUBSCRIBE_INTEROP_M2M', label: t('client.interop') },
        { to: 'SUBSCRIBE_DEBUG_VOUCHER', label: t('client.debugClientAssertion') },
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
          hide: false,
          label: t('tenant.tenantCertifier'),
        },
        {
          to: 'DELEGATIONS',
          hide: false,
          label: t('tenant.delegations'),
        },
      ],
    },
    {
      icon: DeveloperToolIcon,
      rootRouteKey: 'DEVELOPER_TOOLS',
      label: 'Tool per lo sviluppo ',
      hide: false,
      children: [],
    },
  ]

  const theme = useTheme()
  const interopRoutes = useGetSidebarItems(INTEROP_NAVIGATION_ROUTES)
  const matchMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (hideSideNav) {
    return (
      <Box
        component="main"
        sx={{
          px: 3,
          height: '100%',
          py: 2,
          ...sx,
        }}
        bgcolor="#FAFAFA"
      >
        <Box sx={{ maxWidth: 920, mx: 'auto', height: '100%' }}>{children}</Box>
      </Box>
    )
  }

  return (
    <Stack
      id="interop-sidenav-main"
      sx={{
        flexDirection: matchMobile ? 'column' : 'row',
      }}
    >
      <Sidebar mobile={matchMobile} routes={interopRoutes} />
      <Box
        sx={{
          flexGrow: 1,
          px: 3,
          py: 2,
          height: '100%',
          bgcolor: '#FAFAFA',
        }}
      >
        <Box component="main" sx={{ maxWidth: 1280 }}>
          {children}
        </Box>
      </Box>
    </Stack>
  )
}
