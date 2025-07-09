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
import { type SvgIconComponent } from '@mui/icons-material'
import type { Notification } from './sidebar.types'
import { SidebarRootIcon } from './SidebarItemRootIcon'
import { type RouteKey } from '@/router'
import { Link } from 'react-router-dom'
import { sidebarStyles } from './sidebar.styles'

type SidebarItemCollapsableProps = {
  notification?: Notification
  label: string
  isItemSelected: boolean
  subpath: RouteKey
  StartIcon: SvgIconComponent
  divider?: boolean
  collapsed: boolean
  children: React.ReactNode
  handleSelectedRootItem: (routeKey: RouteKey) => void
}

export const SidebarItemCollapsable: React.FC<SidebarItemCollapsableProps> = ({
  children,
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
  const styles = sidebarStyles(theme, collapsed)

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
    return subpath
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
          <List disablePadding>{children}</List>
        </Collapse>
      )}
    </>
  )
}
