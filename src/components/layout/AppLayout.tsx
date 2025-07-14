import React from 'react'
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'
import type { SxProps } from '@mui/material'
import { InteropSidebar } from '../sidebar/InteropSidebar'
import { useGetSidebarItems } from '../sidebar/useGetSidebarItems'

type AppLayoutProps = {
  children: React.ReactNode
  hideSideNav?: boolean
  sx?: SxProps
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, hideSideNav, sx }) => {
  const theme = useTheme()
  const matchMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const interopRoutes = useGetSidebarItems()

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
      <InteropSidebar mobile={matchMobile} routes={interopRoutes} />
      {/* <SideNav /> */}
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
