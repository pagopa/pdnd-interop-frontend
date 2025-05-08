import { type SvgIconComponent } from '@mui/icons-material'
import { ListItemIcon, Badge } from '@mui/material'
import type { Notification } from './sidebar.types'

type SidebarRootIconProps = {
  Icon: SvgIconComponent
  collapsed: boolean
  notification?: Notification
}

export const SidebarRootIcon: React.FC<SidebarRootIconProps> = ({
  Icon,
  collapsed,
  notification,
}) => {
  return !collapsed || !notification || notification?.content <= 0 ? (
    <ListItemIcon>
      <Icon fontSize="inherit" />
    </ListItemIcon>
  ) : (
    <ListItemIcon>
      <Badge color="primary" badgeContent={notification.content} variant="dot">
        <Icon fontSize="inherit" />
      </Badge>
    </ListItemIcon>
  )
}
