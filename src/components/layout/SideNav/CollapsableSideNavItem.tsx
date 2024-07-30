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
import type { SideNavItemView } from './SideNav'
import { SideNavItemLink } from './SideNavItemLink'
import { SIDENAV_WIDTH } from '@/config/constants'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('shared-components', { keyPrefix: 'routeLabels' })

  const handleToggleCollapse = () => {
    toggleCollapse(item.id)
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 360,
        backgroundColor: 'background.paper',
      }}
    >
      <ListItemButton onClick={handleToggleCollapse}>
        <ListItemText primary={t(item.routeKey)} />
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item &&
            item.children &&
            item.children.map((child, j) => <SideNavItemLink routeKey={child} indented key={j} />)}
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
