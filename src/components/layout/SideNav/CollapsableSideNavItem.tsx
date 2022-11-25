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
import { routes } from '@/router/routes'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useCurrentRoute } from '@/router'
import { SideNavItemView } from './SideNav'
import { SideNavItemLink } from './SideNavItemLink'
import { SIDENAV_WIDTH } from '@/config/constants'

type CollapsableSideNavItemProps = {
  item: SideNavItemView
  isOpen: boolean
  toggleCollapse: (id: string | undefined) => void
}

export const CollapsableSideNavItem: React.FC<CollapsableSideNavItemProps> = ({
  item,
  isOpen,
  toggleCollapse,
}) => {
  const currentLanguage = useCurrentLanguage()
  const { isRouteInCurrentSubtree } = useCurrentRoute()

  const route = routes[item.routeKey]
  const isSelected = item.children?.some(isRouteInCurrentSubtree)

  const handleToggleCollapse = () => {
    toggleCollapse(item.id)
  }

  return (
    <Box color={isSelected ? 'primary.main' : 'text.primary'}>
      <ListItemButton sx={{ pl: 3 }} color="inherit" onClick={handleToggleCollapse}>
        <ListItemText
          sx={{ color: 'inherit' }}
          disableTypography
          primary={
            <Typography color="inherit" sx={{ fontWeight: isSelected ? 600 : 300 }}>
              {route.LABEL[currentLanguage]}
            </Typography>
          }
        />
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding sx={{ width: SIDENAV_WIDTH }}>
          {item &&
            item.children &&
            item.children.map((child, j) => (
              <ListItem sx={{ display: 'block', p: 0 }} key={j}>
                <SideNavItemLink routeKey={child} indented />
              </ListItem>
            ))}
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
