import React from 'react'
import {
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
  List,
  Stack,
  Divider,
  useTheme,
} from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTranslation } from 'react-i18next'
import { type SvgIconComponent } from '@mui/icons-material'
import type { Notification, SidebarChildRoutes } from './sidebar.types'
import { BadgeNotification } from './BadgeNotification'
import { SidebarRootIcon } from './SidebarItemRootIcon'
import { useGeneratePath, type RouteKey } from '@/router'
import { SidebarItem } from './SidebarItem'
import { Link } from 'react-router-dom'
import { sidebarStyles } from './sidebar.styles'

type SidebarItemRootBaseProps = {
  notification?: Notification
  label: string
  isItemSelected: boolean
  subpath: RouteKey
  StartIcon: SvgIconComponent
  handleSelectedRootItem: (routeKey: RouteKey) => void
  divider?: boolean
  collapsed: boolean
}

type SidebarItemRootSimpleProps = SidebarItemRootBaseProps & { to: string }

type SidebarItemRootWithChildrenProps = SidebarItemRootBaseProps & {
  childRoutes: SidebarChildRoutes
}

export function useGetRouteLabel(to: RouteKey): string {
  const { t } = useTranslation('shared-components', { keyPrefix: 'routeLabels' })
  return t(to)
}

export const SidebarItemRootSimple: React.FC<SidebarItemRootSimpleProps> = ({
  StartIcon,
  subpath,
  isItemSelected,
  handleSelectedRootItem,
  divider,
  collapsed,
  label,
  notification,
  to,
}) => {
  const theme = useTheme()
  const styles = sidebarStyles(theme, collapsed)

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          selected={isItemSelected}
          to={to}
          onClick={() => handleSelectedRootItem(subpath)}
          sx={styles.itemButtonActive}
        >
          <Stack direction="row" sx={{ flexGrow: 1, paddingLeft: 2 }}>
            <SidebarRootIcon tooltipLabel={label} Icon={StartIcon} notification={notification} />
            {!collapsed && (
              <ListItemText
                disableTypography
                primary={
                  <Typography fontWeight={600} color="inherit">
                    {label}
                  </Typography>
                }
              />
            )}
            {!collapsed && notification && (
              <BadgeNotification badgeContent={notification.content} />
            )}
          </Stack>
        </ListItemButton>
      </ListItem>
      {divider && <Divider sx={{ mb: 2 }} />}
    </>
  )
}

export const SidebarItemRootWithChildren: React.FC<SidebarItemRootWithChildrenProps> = ({
  childRoutes,
  StartIcon,
  subpath,
  isItemSelected,
  handleSelectedRootItem,
  divider,
  collapsed,
  label,
  notification,
}) => {
  const theme = useTheme()
  const generatePath = useGeneratePath()

  const styles = sidebarStyles(theme, collapsed)

  const renderChildRoutesItems = () => {
    return childRoutes
      ?.filter((child) => !child.hide)
      .map((child) => {
        const routeKey = child.to
        return (
          <SidebarItem
            to={generatePath(routeKey)}
            key={routeKey}
            routeKey={routeKey}
            label={child.label}
            component={Link}
            collapsed={true}
            notification={notification}
          />
        )
      })
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const subPathLink = generatePath(subpath)

  console.log('subpath', subpath, 'subPathLink', subPathLink)
  const getComponentType = () => {
    if (!collapsed) {
      return 'button'
    }
    return Link
  }

  const getNavigationLink = () => {
    if (!collapsed) {
      return undefined
    }
    return subPathLink
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          component={getComponentType()}
          selected={collapsed && isItemSelected}
          to={getNavigationLink()}
          onClick={() => handleSelectedRootItem(subpath)}
          sx={collapsed ? styles.itemButtonActive : {}}
        >
          <Stack direction="row" sx={{ flexGrow: 1, paddingLeft: 2 }}>
            <SidebarRootIcon tooltipLabel={label} Icon={StartIcon} notification={notification} />
            {!collapsed && (
              <ListItemText
                disableTypography
                primary={
                  <Typography fontWeight={600} color="inherit">
                    {label}
                  </Typography>
                }
              />
            )}
            {!collapsed && (isItemSelected ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
          </Stack>
        </ListItemButton>
      </ListItem>
      {divider && <Divider sx={{ mb: 2 }} />}
      {!collapsed && (
        <Collapse in={isItemSelected} timeout="auto" unmountOnExit>
          <List disablePadding>{renderChildRoutesItems()}</List>
        </Collapse>
      )}
    </>
  )
}

export type {
  SidebarItemRootBaseProps,
  SidebarItemRootSimpleProps,
  SidebarItemRootWithChildrenProps,
}
