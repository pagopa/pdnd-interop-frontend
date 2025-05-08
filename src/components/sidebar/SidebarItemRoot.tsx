/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  alpha,
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
  const hasChildren = children && children.length > 0

  const renderChildItem = () => {
    return children
      ?.filter((child) => !child.hide)
      .map((child) => {
        const routeKey = child.to
        return (
          <SidebarItem
            key={routeKey}
            label={child.label}
            component={Link}
            collapsed={true}
            routeKey={routeKey}
            notification={notification}
          />
        )
      })
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routeLabel = label ? label : useGetRouteLabel(subpath)
  const generatePath = useGeneratePath()

  const subPathLink = generatePath(subpath)

  return (
    <>
      <ListItem disablePadding>
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
        }
        <ListItemButton
          component={Link}
          selected={hasChildren ? collapsed && isExpanded : isExpanded}
          //@ts-ignore
          to={collapsed && hasChildren ? children[0]?.to : hasChildren ? undefined : subPathLink}
          onClick={handleExpanded}
          sx={
            collapsed || !hasChildren
              ? {
                  '&.active': {
                    fontWeight: 'bold',
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    borderRight: '2px solid',
                    borderColor: theme.palette.primary.dark,
                    '.MuiTypography-root': {
                      fontWeight: 600,
                      color: theme.palette.primary.dark,
                    },
                    '.MuiListItemIcon-root': {
                      color: theme.palette.primary.dark,
                    },
                  },
                }
              : {}
          }
        >
          <Stack direction="row" sx={{ flexGrow: 1, paddingLeft: 2 }}>
            <SidebarRootIcon Icon={StartIcon} collapsed={collapsed} notification={notification} />
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
