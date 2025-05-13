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

type SidebartItemRootProps = {
  notification?: Notification
  label?: string
  isExpanded: boolean
  subpath: RouteKey
  StartIcon: SvgIconComponent
  handleExpanded: () => void
  children?: SidebarChildRoutes
  divider?: boolean
  collapsed: boolean
}

export function useGetRouteLabel(to: RouteKey): string {
  const { t } = useTranslation('shared-components', { keyPrefix: 'routeLabels' })
  return t(to)
}

export const SidebarItemRoot: React.FC<SidebartItemRootProps> = ({
  children,
  StartIcon,
  subpath,
  isExpanded,
  handleExpanded,
  divider,
  collapsed,
  label,
  notification,
}) => {
  const theme = useTheme()
  const generatePath = useGeneratePath()

  const styles = sidebarStyles(theme, collapsed)

  const hasChildren = children && children.length > 0

  const renderChildItem = () => {
    return children
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
    if (hasChildren && !collapsed) {
      return 'button'
    }
    return Link
  }

  const getNavigationLink = () => {
    if (hasChildren && !collapsed) {
      return undefined
    }
    return subPathLink
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          component={getComponentType()}
          selected={hasChildren ? collapsed && isExpanded : isExpanded}
          to={getNavigationLink()}
          onClick={handleExpanded}
          sx={collapsed || !hasChildren ? styles.itemButtonActive : {}}
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
                primary={<Typography color="inherit">{routeLabel}</Typography>}
              />
            )}
            {hasChildren && !collapsed && (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}

            {!hasChildren && !collapsed && notification && (
              <BadgeNotification badgeContent={notification.content} />
            )}
          </Stack>
        </ListItemButton>
      </ListItem>
      {divider && <Divider sx={{ mb: 2 }} />}
      {hasChildren && !collapsed && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List disablePadding>{renderChildItem()}</List>
        </Collapse>
      )}
    </>
  )
}
