import React from 'react'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'
import { RouteKey } from '@/router/types'
import { routes } from '@/router/routes'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { RouterLink, useCurrentRoute } from '@/router'

type SideNavItemLinkProps = {
  routeKey: RouteKey
  StartIcon?: SvgIconComponent
  EndIcon?: SvgIconComponent
  indented?: boolean
}

export const SideNavItemLink: React.FC<SideNavItemLinkProps> = ({
  routeKey,
  StartIcon,
  EndIcon,
  indented = false,
}) => {
  const currentLanguage = useCurrentLanguage()
  const { isRouteInCurrentSubtree } = useCurrentRoute()
  const route = routes[routeKey]
  const label = route.LABEL[currentLanguage]
  const isSelected = isRouteInCurrentSubtree(routeKey)

  return (
    <ListItemButton
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      component={RouterLink}
      underline="none"
      to={routeKey}
      sx={{
        pl: 3,
        py: 2,
        display: 'flex',
        borderRight: 2,
        borderColor: isSelected ? 'primary.main' : 'transparent',
        backgroundColor: isSelected ? 'rgba(0, 115, 230, 0.08)' : 'transparent',
        color: isSelected ? 'primary.main' : 'text.primary',
      }}
    >
      {StartIcon && (
        <ListItemIcon>
          <StartIcon fontSize="inherit" color={isSelected ? 'primary' : undefined} />
        </ListItemIcon>
      )}
      <ListItemText
        disableTypography
        sx={{ color: 'inherit' }}
        primary={
          <Typography
            color="inherit"
            sx={{ fontWeight: isSelected ? 600 : 300, pl: indented ? 4 : 0 }}
          >
            {label}
          </Typography>
        }
      />
      {EndIcon && (
        <ListItemIcon>
          <EndIcon color="action" />
        </ListItemIcon>
      )}
    </ListItemButton>
  )
}

export const SideNavItemLinkSkeleton: React.FC = () => {
  return (
    <ListItem
      sx={{
        pl: 3,
        py: 2,
        borderRight: 2,
        borderColor: 'transparent',
      }}
    >
      <ListItemText
        disableTypography
        primary={
          <Typography>
            <Skeleton width={160} />
          </Typography>
        }
      />
    </ListItem>
  )
}
