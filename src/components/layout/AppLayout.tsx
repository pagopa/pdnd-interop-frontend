import React from 'react'
import { Box, Stack, SxProps } from '@mui/material'
import { SideNav } from './SideNav'
import { useCurrentRoute } from '@/router'
import { Breadcrumbs } from './Breadcrumbs'
import { useRouteError } from 'react-router-dom'

type Props = {
  children: React.ReactNode
  hideSideNav?: boolean
  sx?: SxProps
}

export const AppLayout: React.FC<Props> = ({ children, sx }) => {
  const { route } = useCurrentRoute()
  const error = useRouteError()
  const hasSideNav = !route.PUBLIC

  if (!hasSideNav || error) {
    return (
      <>
        <Box
          component="main"
          sx={{
            height: '100%',
            px: 3,
            py: 2,
            ...sx,
          }}
          bgcolor="#FAFAFA"
        >
          <Box sx={{ maxWidth: 1280, mx: 'auto' }}>{children}</Box>
        </Box>
      </>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
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
            {!error && <Breadcrumbs />}

            {children}
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
