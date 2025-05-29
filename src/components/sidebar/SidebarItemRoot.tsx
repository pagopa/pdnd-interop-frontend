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
import { has } from 'lodash'

type SidebartItemRootProps = {
  notification?: Notification
  label?: string
  isItemSelected: boolean
  subpath: RouteKey
  StartIcon: SvgIconComponent
  handleSelectedRootItem: (routeKey: RouteKey) => void
  childRoutes?: SidebarChildRoutes
  divider?: boolean
  collapsed: boolean
}

export function useGetRouteLabel(to: RouteKey): string {
  const { t } = useTranslation('shared-components', { keyPrefix: 'routeLabels' })
  return t(to)
}

export const SidebarItemRoot: React.FC<SidebartItemRootProps> = ({
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

  const hasChildRoutes = childRoutes && childRoutes.length > 0

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
  const routeLabel = label ? label : useGetRouteLabel(subpath)
  const subPathLink = generatePath(subpath)

  const getComponentType = () => {
    if (hasChildRoutes && !collapsed) {
      return 'button'
    }
    return Link
  }

  const getNavigationLink = () => {
    if (hasChildRoutes && !collapsed) {
      return undefined
    }
    return subPathLink
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          component={getComponentType()}
          selected={hasChildRoutes ? collapsed && isItemSelected : isItemSelected}
          to={getNavigationLink()}
          onClick={() => handleSelectedRootItem(subpath)}
          sx={collapsed || !hasChildRoutes ? styles.itemButtonActive : {}}
        >
          <Stack direction="row" sx={{ flexGrow: 1, paddingLeft: 2 }}>
            <SidebarRootIcon
              tooltipLabel={routeLabel}
              Icon={StartIcon}
              collapsed={collapsed}
              notification={notification}
            />
            {!collapsed && (
              <ListItemText
                disableTypography
                primary={
                  <Typography fontWeight={600} color="inherit">
                    {routeLabel}
                  </Typography>
                }
              />
            )}
            {hasChildRoutes &&
              !collapsed &&
              (isItemSelected ? <ExpandLessIcon /> : <ExpandMoreIcon />)}

            {!hasChildRoutes && !collapsed && notification && (
              <BadgeNotification badgeContent={notification.content} />
            )}
          </Stack>
        </ListItemButton>
      </ListItem>
      {divider && <Divider sx={{ mb: 2 }} />}
      {hasChildRoutes && !collapsed && (
        <Collapse in={isItemSelected} timeout="auto" unmountOnExit>
          <List disablePadding>{renderChildRoutesItems()}</List>
        </Collapse>
      )}
    </>
  )
}
