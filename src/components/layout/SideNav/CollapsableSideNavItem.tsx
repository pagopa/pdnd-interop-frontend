import React from 'react'
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { SIDENAV_WIDTH } from '@/config/constants'
import { useTranslation } from 'react-i18next'
import type { RegisteredRouter, RoutePaths } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { useIsAuthorizedToAccessRoute } from '@/hooks/useIsAuthorizedToAccessRoute'
import { useCurrentRoute } from '@/router'

type CollapsableSideNavItemProps = {
  subpath: RoutePaths<RegisteredRouter['routeTree']>
  isOpen: boolean
  onToggle: (id: string | undefined) => void
  children: React.ReactNode
}

export const CollapsableSideNavItem: React.FC<CollapsableSideNavItemProps> = ({
  subpath,
  isOpen,
  onToggle,
  children,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'routeLabels' })
  const route = useRouter().routesByPath[subpath]
  const isSelected = useCurrentRoute().pathname.includes(subpath)

  const isUserAuthorizedToAccessRoute = useIsAuthorizedToAccessRoute({ routeId: route.id })

  if (!isUserAuthorizedToAccessRoute) {
    return null
  }

  return (
    <Box color={isSelected ? 'primary.main' : 'text.primary'}>
      <ListItemButton
        sx={{ pl: 3 }}
        color="inherit"
        onClick={() => {
          onToggle(isOpen ? undefined : subpath)
        }}
      >
        <ListItemText
          sx={{ color: 'inherit' }}
          disableTypography
          primary={
            <Typography color="inherit" sx={{ fontWeight: isSelected ? 600 : 300 }}>
              {t(route.options.staticData?.routeKey as never)}
            </Typography>
          }
        />
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding sx={{ width: SIDENAV_WIDTH }}>
          {children}
        </List>
      </Collapse>
    </Box>
  )
}

export const CollapsableSideNavItemSkeleton: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box>
      <ListItem sx={{ pl: 3, py: 2 }}>
        <ListItemText
          disableTypography
          primary={
            <Typography>
              <Skeleton width={120} />
            </Typography>
          }
        />
        {children ? <ExpandLessIcon color="disabled" /> : <ExpandMoreIcon color="disabled" />}
      </ListItem>

      <List disablePadding sx={{ width: SIDENAV_WIDTH, pl: 4 }}>
        {children}
      </List>
    </Box>
  )
}
