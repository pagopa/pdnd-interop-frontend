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
type AppLayoutProps = {
  children: React.ReactNode
  hideSideNav?: boolean
  sx?: SxProps
}

const INTEROP_NAVIGATION_ROUTES: SidebarRoutes = [
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
      { to: 'SUBSCRIBE_AGREEMENT_LIST', label: 'Richieste inoltrate' },
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
      { to: 'PROVIDE_ESERVICE_LIST', label: 'I miei e-service' },
      { to: 'PROVIDE_AGREEMENT_LIST', label: 'Richieste ricevute' },
      { to: 'PROVIDE_PURPOSE_LIST', label: 'Finalità ricevute' },
      { to: 'PROVIDE_ESERVICE_TEMPLATE_CATALOG', label: 'Template e-service' },
      { to: 'PROVIDE_ESERVICE_TEMPLATE_LIST', label: 'I miei template' },
      { to: 'PROVIDE_KEYCHAINS_LIST', label: 'I miei portachiavi erogatore' },
    ],
  },
  {
    icon: DnsIcon,
    rootRouteKey: 'PROVIDE_KEYCHAINS_LIST',
    label: 'Gestione del client',
    hide: false,
    children: [
      { to: 'SUBSCRIBE_CLIENT_LIST', label: 'API e-service' },
      { to: 'SUBSCRIBE_INTEROP_M2M', label: 'API interoperabilità' },
      { to: 'SUBSCRIBE_DEBUG_VOUCHER', label: 'Debug client assertion' },
    ],
  },
  {
    icon: MyTenantIcon,
    label: 'Il mio ente',
    rootRouteKey: 'PARTY_REGISTRY',
    children: [
      { to: 'PARTY_REGISTRY', label: 'Anagrafica e attributi' },
      {
        to: 'TENANT_CERTIFIER',
        hide: false,
        label: 'Ente certificatore',
      },
      {
        to: 'DELEGATIONS',
        hide: false,
        label: 'Gestione delle deleghe',
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

export const AppLayout: React.FC<AppLayoutProps> = ({ children, hideSideNav, sx }) => {
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
