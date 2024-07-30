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
import { type RouteKey, useNavigate } from '@/router'
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
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'routeLabels' })
  const isRouteInCurrentSubtree = useIsRouteInCurrentSubtree()
  const isSelected = isRouteInCurrentSubtree(routeKey)

  const navigate = useNavigate()

  return (
    <ListItemButton selected={isSelected} sx={{ pl: 6 }} onClick={() => navigate(routeKey)}>
      {StartIcon && (
        <ListItemIcon>
          <StartIcon fontSize="inherit" />
        </ListItemIcon>
      )}
      <ListItemText primary={t(routeKey)} />
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
