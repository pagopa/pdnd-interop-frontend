import React from 'react'
import { Box, Stack } from '@mui/material'
import type { SxProps } from '@mui/material'
import { SideNav } from '@/components/layout'
import type { SidebarRoutes } from '../sidebar/sidebar.types'
import PeopleIcon from '@mui/icons-material/People'
import { Sidebar } from '../sidebar/Sidebar'

type AppLayoutProps = {
  children: React.ReactNode
  hideSideNav?: boolean
  sx?: SxProps
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, hideSideNav, sx }) => {
  const interopRoutes: SidebarRoutes = [
    {
      subpath: 'SUBSCRIBE_CATALOG_LIST',
      icon: PeopleIcon,
      children: [],
      divider: true,
    },
    {
      showNotification: false,
      icon: PeopleIcon,
      label: 'Fruizione',
      subpath: 'PROVIDE_AGREEMENT_LIST',
      children: [
        { to: 'PROVIDE_AGREEMENT_LIST', label: 'Richieste inoltrate' },
        { to: 'SUBSCRIBE_PURPOSE_LIST', label: 'Finalità inoltrate' },
      ],
      divider: false,
    },
    {
      icon: PeopleIcon,
      label: 'Erogazione',
      subpath: 'PROVIDE_ESERVICE_LIST',
      hide: false,
      children: [
        { to: 'PROVIDE_ESERVICE_TEMPLATE_LIST', label: 'Template E-Service' },
        { to: 'PROVIDE_ESERVICE_LIST', label: 'I Miei E-service' },
        { to: 'PROVIDE_AGREEMENT_LIST', label: 'Richieste di fruizione' },
        { to: 'PROVIDE_PURPOSE_LIST', label: 'Finalità ricevute' },
      ],
    },
    // {
    //   icon: PeopleIcon,
    //   subpath: '/privacy-policy',
    //   label: 'Gestione del client',
    //   hide: false,
    //   children: [
    //     { to: '/gestione-client/portachiavi', label: 'Portachiavi' },
    //     { to: '/gestione-client/api-fruizione', label: 'API fruizione' },
    //     { to: '/gestione-client/api-fruizione-interop', label: 'API Fruizione Interop' },
    //     { to: '/gestione-client/debug-client-assertion', label: 'Debug client assertion' },
    //   ],
    // },
    // {
    //   icon: PeopleIcon,
    //   label: 'Il mio ente',
    //   subpath: '/il-mio-ente',
    //   children: [
    //     { to: '/il-mio-ente/anagrafica', label: 'Anagrafica e attributi' },
    //     {
    //       to: '/il-mio-ente/gestione-delle-deleghe',
    //       hide: false,
    //       label: 'Gestione delle deleghe',
    //     },
    //   ],
    // },
  ]

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
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Stack direction="row" sx={{ height: '100%', overflowX: 'hidden' }}>
        {/* <SideNav /> */}
        <Sidebar routes={interopRoutes} />
        <Box
          sx={{
            px: 3,
            py: 2,
            flexGrow: 1,
            position: 'relative',
            '::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: 0,
              bgcolor: 'background.default',
              width: 10000,
              height: '100%',
              transform: 'translate(100%, 0)',
            },
          }}
          bgcolor="#FAFAFA"
        >
          <Box component="main" sx={{ height: '100%', maxWidth: 1280 }}>
            {children}
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
