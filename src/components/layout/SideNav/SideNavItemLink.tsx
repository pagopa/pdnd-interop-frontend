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
import { useTranslation } from 'react-i18next'
import type { RoutePaths, RegisteredRouter } from '@tanstack/react-router'
import { createLink, useRouter, useChildMatches } from '@tanstack/react-router'
import { useIsAuthorizedToAccessRoute } from '@/hooks/useIsAuthorizedToAccessRoute'

const RouterListItemButton = createLink(ListItemButton)

type SideNavItemLinkProps = {
  to: RoutePaths<RegisteredRouter['routeTree']>
  StartIcon?: SvgIconComponent
  EndIcon?: SvgIconComponent
  indented?: boolean
}

export const SideNavItemLink: React.FC<SideNavItemLinkProps> = ({
  to,
  StartIcon,
  EndIcon,
  indented = false,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'routeLabels' })
  const route = useRouter().routesByPath[to]

  const isSelected = useChildMatches({
    select: (m) => m[m.length - 1].pathname.includes(to),
  })

  const isUserAuthorizedToAccessRoute = useIsAuthorizedToAccessRoute({ routeId: route.id })

  if (!isUserAuthorizedToAccessRoute) {
    return null
  }

  return (
    <ListItem sx={{ display: 'block', p: 0 }}>
      <RouterListItemButton
        to={to}
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
              {t(route.options.staticData?.routeKey as never)}
            </Typography>
          }
        />
        {EndIcon && (
          <ListItemIcon>
            <EndIcon color="action" />
          </ListItemIcon>
        )}
      </RouterListItemButton>
    </ListItem>
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
