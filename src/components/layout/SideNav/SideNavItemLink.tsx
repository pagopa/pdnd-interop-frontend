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
import { type RouteKey } from '@/router'
import { Link } from '@/router'
import { useTranslation } from 'react-i18next'
import { useIsRouteInCurrentSubtree } from './hooks/useIsRouteInCurrentSubtree'

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
  const { t } = useTranslation('shared-components', { keyPrefix: 'routeLabels' })
  const isRouteInCurrentSubtree = useIsRouteInCurrentSubtree()
  const isSelected = isRouteInCurrentSubtree(routeKey)

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    <ListItemButton
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      component={Link}
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
            {t(routeKey)}
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
