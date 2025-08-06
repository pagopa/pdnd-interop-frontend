import React from 'react'
import { type SvgIconComponent } from '@mui/icons-material'
import { ListItemIcon, Badge } from '@mui/material'
import type { Notification } from '../sidebar.types'

type SidebarIconProps = {
  Icon: SvgIconComponent
  notification?: Notification
}

export const SidebarIcon: React.FC<SidebarIconProps> = ({ Icon, notification }) => {
  return (
    <ListItemIcon>
      {!notification || notification?.content <= 0 ? (
        <Icon fontSize="inherit" />
      ) : (
        <Badge color="primary" badgeContent={notification.content} variant="dot">
          <Icon fontSize="inherit" />
        </Badge>
      )}
    </ListItemIcon>
  )
}
