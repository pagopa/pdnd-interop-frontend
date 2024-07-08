import React from 'react'
import { Box, Stack } from '@mui/material'
// import { SideNav } from '@/components/layout'
import { createFileRoute, useMatches, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authentication-guard/_tos-guard/_app-layout')({
  component: AppLayout,
})

function AppLayout() {
  const shouldHideSidenav = Boolean(
    useMatches({ select: (m) => m[m.length - 1].staticData.hideSideNav })
  )

  if (shouldHideSidenav) {
    return (
      <Box
        component="main"
        sx={{
          px: 3,
          height: '100%',
          py: 2,
        }}
        bgcolor="#FAFAFA"
      >
        <Box sx={{ maxWidth: 920, mx: 'auto', height: '100%' }}>
          <Outlet />
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Stack direction="row" sx={{ height: '100%', overflowX: 'hidden' }}>
        {/* <SideNav /> */}
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
            <Outlet />
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
