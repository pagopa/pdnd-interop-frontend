import React from 'react'
import { type SvgIconComponent } from '@mui/icons-material'
import { ListItemIcon, Badge, Tooltip } from '@mui/material'
import type { Notification } from './sidebar.types'

type SidebarRootIconProps = {
  Icon: SvgIconComponent
  collapsed: boolean
  notification?: Notification
  tooltipLabel: string
}

export const SidebarRootIcon: React.FC<SidebarRootIconProps> = ({
  Icon,
  collapsed,
  notification,
  tooltipLabel,
}) => {
  return !collapsed || !notification || notification?.content <= 0 ? (
    <Tooltip title={tooltipLabel}>
      <ListItemIcon>
        <Icon fontSize="inherit" />
      </ListItemIcon>
    </Tooltip>
  ) : (
    <ListItemIcon>
      <Badge color="primary" badgeContent={notification.content} variant="dot">
        <Icon fontSize="inherit" />
      </Badge>
    </ListItemIcon>
  )
}
