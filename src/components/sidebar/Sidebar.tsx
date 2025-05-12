import React from 'react'
import {
  Box,
  Divider,
  List,
  useTheme,
  Tooltip,
  IconButton,
  Stack,
  useMediaQuery,
  Typography,
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
import { match } from 'assert'

type SidebarProps = {
  routes: SidebarRoutes
}
export const Sidebar: React.FC<SidebarProps> = ({ routes }) => {
  const theme = useTheme()
  // const pathname = useCurrentRoute().pathname
  const pathname = useCurrentRoute().routeKey
  const { t } = useTranslation('shared-components', { keyPrefix: 'sidenav' })

  const matchMobile = useMediaQuery(theme.breakpoints.down('sm'))

  console.log('matchmobile', matchMobile)

  const [collapsed, setCollapsed] = useState(false)
  const handleCollapsed = () => {
    setCollapsed((prev) => !prev)
  }

  const styles = sidebarStyles(theme, collapsed)

  const [expandItemRoot, setExpandItemRoot] = useState<RouteKey | undefined>(
    () => routes.find((route) => pathname.startsWith(route.subpath))?.subpath
  )

  const handleExpandItemRoot = (subpath: RouteKey) => {
    setExpandItemRoot((prev) => (prev === subpath ? undefined : subpath))
  }
  return (
    <Box sx={styles.container} component="aside">
      {matchMobile ? (
        <Stack
          component="nav"
          display="flex"
          flexDirection="column"
          aria-expanded={!collapsed}
          aria-label={t('navigationMenu')}
          role="navigation"
          sx={styles.nav}
        >
          <SidebarList
            routes={routes}
            expandItemRoot={expandItemRoot}
            handleExpandItemRoot={handleExpandItemRoot}
            collapsed={collapsed}
          />
          <HamburgerBox collapsed={collapsed} handleCollapsed={handleCollapsed} />
        </Stack>
      ) : (
        <SidebarMobile routes={routes} />
      )}
    </Box>
  )
}

type SidebarListProps = {
  routes: SidebarRoutes
  expandItemRoot: RouteKey | undefined
  handleExpandItemRoot: (subpath: RouteKey) => void
  collapsed: boolean
}
const SidebarList: React.FC<SidebarListProps> = ({
  routes,
  expandItemRoot,
  handleExpandItemRoot,
  collapsed,
}) => {
  return (
    <List disablePadding sx={{ marginTop: 1 }}>
      {routes
        .filter(({ hide }) => !hide)
        .map((route) => (
          <SidebarItemRoot
            key={route.label}
            notification={{
              show: route?.showNotification ?? false,
              content: 0, // TODO: This will change, right now is fixed
            }}
            label={route.label}
            divider={route.divider}
            isExpanded={expandItemRoot === route.subpath}
            // eslint-disable-next-line react/no-children-prop
            children={route?.children}
            StartIcon={route.icon}
            subpath={route.subpath}
            handleExpanded={() => handleExpandItemRoot(route.subpath)}
            collapsed={collapsed}
          />
        ))}
      <Divider />
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

const SidebarMobile: React.FC<SidebarProps> = ({ routes }) => {
  const pathname = useCurrentRoute().routeKey
  // const pathname = useCurrentRoute().pathname

  console.log('MOBILE')
  const [expandItemRoot, setExpandItemRoot] = useState<RouteKey | undefined>(
    () => routes.find((route) => pathname.startsWith(route.subpath))?.subpath
  )

  const [isOpenSidebar, setIsOpenSidebar] = useState(false)

  const handleExpandItemRoot = (subpath: RouteKey) => {
    setExpandItemRoot((prev) => (prev === subpath ? undefined : subpath))
  }

  const handleOpenSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar)
  }

  return (
    <>
      <Box display="flex" flexDirection="row" padding={1}>
        <Tooltip placement="right" title="Menu">
          <IconButton
            sx={{ padding: { xs: 1 } }}
            data-testid="hamburgerButton"
            aria-label="hamburger-icon"
            onClick={handleOpenSidebar}
            size="large"
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
        <Typography ml={1} mt={1} variant="h6" component="h6">
          Menù
        </Typography>
      </Box>
      <Divider orientation="horizontal" component="div" />
      {isOpenSidebar && (
        <>
          <SidebarList
            routes={routes}
            expandItemRoot={expandItemRoot}
            handleExpandItemRoot={handleExpandItemRoot}
            collapsed={false}
          />
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
  const { t } = useTranslation('shared-components', { keyPrefix: 'sidenav' })
  const tooltipTitle = t(!collapsed ? 'collapse' : 'expand')

  return (
    <Box sx={styles.hamburgerBox}>
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
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
