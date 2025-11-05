import React from 'react'
import { type SvgIconComponent } from '@mui/icons-material'
import { ListItemIcon, Badge } from '@mui/material'

type SidebarIconProps = {
  Icon: SvgIconComponent
  notification?: number
}

export const SidebarIcon: React.FC<SidebarIconProps> = ({ Icon, notification }) => {
  return (
    <ListItemIcon>
      {!notification ? (
        <Icon fontSize="inherit" />
      ) : (
        <Badge color="primary" badgeContent={notification} variant="dot">
          <Icon fontSize="inherit" />
        </Badge>
      )}
    </ListItemIcon>
  )
}
