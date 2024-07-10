import React from 'react'
import { Box, Stack } from '@mui/material'
import type { SxProps } from '@mui/material'
import { SideNav } from '@/components/layout'
import { PageContainerSkeleton } from './containers'
import { SideNavSkeleton } from './SideNav'

export const AppLayout = ({
  children,
  hideSideNav,
  sx,
}: {
  children: React.ReactNode
  hideSideNav?: boolean
  sx?: SxProps
}) => {
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
        <SideNav />
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

export const AppLayoutSkeleton = ({ hideSideNav }: { hideSideNav?: boolean }) => {
  if (hideSideNav)
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
          <PageContainerSkeleton />
        </Box>
      </Box>
    )

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Stack direction="row" sx={{ height: '100%', overflowX: 'hidden' }}>
        <SideNavSkeleton />
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
            <PageContainerSkeleton />
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
