import React from 'react'
import {
  Box,
  Divider,
  List,
  useTheme,
  Tooltip,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { sidebarStyles } from './sidebar.styles'
import { SidebarItemRoot } from './SidebarItemRoot'
import { useState } from 'react'
import { type RouteKey, useCurrentRoute } from '@/router'
import MenuIcon from '@mui/icons-material/Menu'
import { getCurrentSelfCareProductId } from '@/utils/common.utils'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import PeopleIcon from '@mui/icons-material/People'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import { SidebarLink } from './SidebarLink'
import { useTranslation } from 'react-i18next'
import type { SidebarRoutes } from './sidebar.types'
import { SELFCARE_BASE_URL } from '@/config/env'
import { t } from 'i18next'
import { useGetSidebarItems } from './useGetSidebarItems'

type SidebarProps = {
  mobile: boolean
}

type SidebarListProps = {
  routes: SidebarRoutes
  collapsed: boolean
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { t } = useTranslation('sidebar')
  const theme = useTheme()
  const interopRoutes = useGetSidebarItems()
  const matchMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [collapsed, setCollapsed] = useState(false)
  const styles = sidebarStyles(theme, collapsed)

  const handleCollapsed = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <>
      {!matchMobile ? (
        <Box sx={styles.container} component="aside">
          <Stack
            component="nav"
            role="navigation"
            aria-label={t('navigationMenu')}
            aria-expanded={!collapsed}
          >
            <SidebarList routes={interopRoutes} collapsed={collapsed} />
            <HamburgerBox collapsed={collapsed} handleCollapsed={handleCollapsed} />
          </Stack>
        </Box>
      ) : (
        <SidebarMobile routes={interopRoutes} />
      )}
    </>
  )
}

const SidebarList: React.FC<SidebarListProps> = ({ collapsed, routes }) => {
  const interopRoutes = useGetSidebarItems()
  const pathname = useCurrentRoute().routeKey

  const [selectedRootItem, setSelectedRootItem] = useState<RouteKey | undefined>(
    () => interopRoutes.find((route) => pathname.startsWith(route.rootRouteKey))?.rootRouteKey
  )

  const handleSelectedRootItem = (routeKey: RouteKey) => {
    if (!collapsed) {
      setSelectedRootItem((prev) => (prev === routeKey ? undefined : routeKey))
    } else {
      setSelectedRootItem(routeKey)
    }
  }

  return (
    <List disablePadding sx={{ marginTop: 1 }}>
      {routes
        .filter(({ hide }) => !hide)
        .map((route) => (
          <SidebarItemRoot
            key={route.label}
            notification={{
              show: route?.showNotification ?? false,
              // TODO: This will change, right now is fixed to 0
              content: 0,
            }}
            label={route.label}
            divider={route.divider}
            isItemSelected={selectedRootItem === route.rootRouteKey}
            // eslint-disable-next-line react/no-children-prop
            childRoutes={route?.children}
            StartIcon={route.icon}
            subpath={route.rootRouteKey}
            handleSelectedRootItem={handleSelectedRootItem}
            collapsed={collapsed}
          />
        ))}
      <Divider sx={{ marginBottom: 2 }} />
      <SidebarLink
        label="Utenti"
        component="a"
        href={`${SELFCARE_BASE_URL}/dashboard/${getCurrentSelfCareProductId()}/users#${getCurrentSelfCareProductId()}`}
        target="_blank"
        StartIcon={PeopleIcon}
        EndIcon={ExitToAppRoundedIcon}
        typographyProps={{ sx: { fontWeight: 600 } }}
        collapsed={collapsed}
      />
      <SidebarLink
        label="Gruppi"
        href={`${SELFCARE_BASE_URL}/dashboard/${getCurrentSelfCareProductId()}/groups`}
        target="_blank"
        StartIcon={SupervisedUserCircleIcon}
        EndIcon={ExitToAppRoundedIcon}
        typographyProps={{ sx: { fontWeight: 600 } }}
        collapsed={collapsed}
      />
    </List>
  )
}

const SidebarMobile: React.FC<{ routes: SidebarRoutes }> = ({ routes }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)

  const handleOpenSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar)
  }

  return (
    <>
      <Box display="flex" flexDirection="row" padding={1}>
        <Tooltip placement="right" title="Menu">
          <IconButton
            sx={{ padding: { xs: 1 } }}
            data-testid="hamburger-mobile-icon"
            aria-label="hamburger-mobile-icon"
            onClick={handleOpenSidebar}
            size="large"
          >
            <MenuIcon color="disabled" />
          </IconButton>
        </Tooltip>
        <Typography ml={1} mt={1} variant="h6" component="h6">
          {t('sidebar:navigationMenu')}
        </Typography>
      </Box>
      <Divider orientation="horizontal" component="div" />
      {isOpenSidebar && (
        <>
          <SidebarList routes={routes} collapsed={false} />
        </>
      )}
    </>
  )
}

type HamburgerMenuBoxProps = {
  collapsed: boolean
  handleCollapsed: () => void
}
const HamburgerBox: React.FC<HamburgerMenuBoxProps> = ({ collapsed, handleCollapsed }) => {
  const theme = useTheme()
  const styles = sidebarStyles(theme, collapsed)
  const { t } = useTranslation('sidebar')
  const tooltipTitle = t(!collapsed ? 'collapse' : 'expand')

  return (
    <Box sx={styles.hamburgerBox} data-testid="hamburger-box-icon">
      <Divider orientation="horizontal" />
      <Box sx={styles.hamburgerIcon}>
        <Tooltip placement="right" title={tooltipTitle}>
          <IconButton
            sx={{ padding: { xs: 1 } }}
            data-testid="hamburgerButton"
            aria-label="hamburger-icon"
            onClick={handleCollapsed}
            size="large"
          >
            <MenuIcon sx={{ fill: '#17324D' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
