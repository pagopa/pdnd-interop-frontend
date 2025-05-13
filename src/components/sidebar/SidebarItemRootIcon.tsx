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
  return (
    <Tooltip title={tooltipLabel}>
      <ListItemIcon>
        {!collapsed || !notification || notification?.content <= 0 ? (
          <Icon fontSize="inherit" />
        ) : (
          <Badge color="primary" badgeContent={notification.content} variant="dot">
            <Icon fontSize="inherit" />
          </Badge>
        )}
      </ListItemIcon>
    </Tooltip>
  )
}
