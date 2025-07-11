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
import { SidebarItemCollapsable } from './SidebarItemCollapsable'
import { useState } from 'react'
import { type RouteKey, useCurrentRoute, useGeneratePath } from '@/router'
import MenuIcon from '@mui/icons-material/Menu'
import { getCurrentSelfCareProductId } from '@/utils/common.utils'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import PeopleIcon from '@mui/icons-material/People'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import { useTranslation } from 'react-i18next'
import type { SidebarRoute, SidebarRoutes } from './sidebar.types'
import { SELFCARE_BASE_URL } from '@/config/env'
import { t } from 'i18next'
import { SidebarItemLink, type SidebarItemLinkProps } from './SidebarItemLink'
import { Link } from 'react-router-dom'
import { useIsRouteInCurrentSubtree } from '../layout/SideNav/hooks/useIsRouteInCurrentSubtree'
import { AuthHooks } from '@/api/auth'

type SidebarProps = {
  routes: SidebarRoutes
  mobile: boolean
}

type SidebarListProps = {
  routes: SidebarRoutes
  collapsed: boolean
}

export const InteropSidebar: React.FC<SidebarProps> = ({ routes, mobile }) => {
  const { t } = useTranslation('sidebar')
  const theme = useTheme()

  const [collapsed, setCollapsed] = useState(false)
  const styles = sidebarStyles(theme, collapsed)

  const handleCollapsed = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <>
      {!mobile ? (
        <Box sx={styles.container} component="aside">
          <Stack
            component="nav"
            role="navigation"
            aria-label={t('navigationMenu')}
            aria-expanded={!collapsed}
          >
            <InteropSidebarList routes={routes} collapsed={collapsed} />
            <HamburgerBox collapsed={collapsed} handleCollapsed={handleCollapsed} />
          </Stack>
        </Box>
      ) : (
        <SidebarMobile routes={routes} />
      )}
    </>
  )
}

const InteropSidebarList: React.FC<SidebarListProps> = ({ collapsed, routes }) => {
  const generatePath = useGeneratePath()
  const isRouteInCurrentSubtree = useIsRouteInCurrentSubtree()
  const pathname = useCurrentRoute().routeKey
  const { jwt } = AuthHooks.useJwt()

  const selfcareUsersPageUrl =
    jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/users#${getCurrentSelfCareProductId()}`
  const selfcareGroupsPageUrl = jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/groups`

  const [parentExpandedItem, setParentExpandedItem] = useState<string | undefined>(
    routes.find(
      (route) =>
        route.rootRouteKey === pathname || route.children?.some((child) => child.to === pathname)
    )?.rootRouteKey
  )

  const handleExpandParent = (routeKey: RouteKey) => {
    setParentExpandedItem((prev) => (prev === routeKey ? undefined : routeKey))
  }

  const renderChildItems = (route: SidebarRoute) =>
    route.children
      ?.filter((child) => !child.hide)
      .map((child) => {
        const routeKey = child.to
        return (
          <SidebarItemLink
            isSelected={isRouteInCurrentSubtree(routeKey)}
            component={Link}
            to={generatePath(routeKey)}
            key={routeKey}
            label={child.label}
            collapsed={collapsed}
            notification={{
              content: 0,
              show: true,
            }}
          />
        )
      })

  return (
    <List disablePadding sx={{ marginTop: 1 }}>
      {routes
        .filter(({ hide }) => !hide)
        .map((route) => {
          const sidebarItemLinkProps: SidebarItemLinkProps<typeof Link> = {
            isSelected: isRouteInCurrentSubtree(route.rootRouteKey),
            StartIcon: route.icon,
            label: route.label,
            collapsed,
            notification: {
              content: 0,
              show: true,
            },
            component: Link,
            to: generatePath(route.rootRouteKey),
          }

          if (route.children && route.children.length > 0) {
            return collapsed ? (
              <SidebarItemLink key={route.label} {...sidebarItemLinkProps} />
            ) : (
              <SidebarItemCollapsable
                key={route.label}
                notification={{
                  show: route?.showNotification ?? false,
                  content: 10,
                }}
                label={route.label}
                divider={route.divider}
                isSelected={route.children?.some((child) => isRouteInCurrentSubtree(child.to))}
                isExpanded={parentExpandedItem === route.rootRouteKey}
                handleExpandParent={() => handleExpandParent(route.rootRouteKey)}
                icon={route.icon}
                to={generatePath(route.rootRouteKey)}
                collapsed={collapsed}
              >
                {renderChildItems(route)}
              </SidebarItemCollapsable>
            )
          }

          return <SidebarItemLink key={route.label} {...sidebarItemLinkProps} />
        })}
      <Divider sx={{ marginBottom: 2 }} />
      <SidebarItemLink
        href={selfcareUsersPageUrl}
        label="Utenti"
        StartIcon={PeopleIcon}
        EndIcon={ExitToAppRoundedIcon}
        collapsed={collapsed}
      />
      <SidebarItemLink
        href={selfcareGroupsPageUrl}
        label="Gruppi"
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
          <InteropSidebarList routes={routes} collapsed={false} />
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
