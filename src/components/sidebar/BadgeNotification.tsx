import React from 'react'
import { Badge } from '@mui/material'

type BadgeNotificationProps = {
  badgeContent: number
}
export const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badgeContent }) => {
  return (
    badgeContent > 0 && (
      <Badge
        sx={{
          '&.MuiBadge-root': {
            alignItems: 'center',
            paddingRight: 0.5,
          },
        }}
        variant="sidenav"
        color="primary"
        badgeContent={badgeContent}
      />
    )
  )
}
