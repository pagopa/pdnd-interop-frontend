import React from 'react'
import { type SvgIconComponent } from '@mui/icons-material'
import { ListItemIcon, Badge, Tooltip } from '@mui/material'
import type { Notification } from './sidebar.types'

type SidebarRootIconProps = {
  Icon: SvgIconComponent
  notification?: Notification
  tooltipLabel: string
}

export const SidebarRootIcon: React.FC<SidebarRootIconProps> = ({
  Icon,

  notification,
  tooltipLabel,
}) => {
  return (
    <Tooltip title={tooltipLabel} placement="right">
      <ListItemIcon>
        {!notification || notification?.content <= 0 ? (
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
