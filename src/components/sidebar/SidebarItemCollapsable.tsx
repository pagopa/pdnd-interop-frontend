import React from 'react'
import {
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
  List,
  Stack,
  Divider,
} from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { type SvgIconComponent } from '@mui/icons-material'
import type { Notification } from './sidebar.types'
import { SidebarRootIcon } from './SidebarItemRootIcon'
import { Link } from 'react-router-dom'

type SidebarItemCollapsableProps = {
  notification?: Notification
  label: string
  isExpanded: boolean
  isSelected: boolean
  icon: SvgIconComponent
  divider?: boolean
  collapsed: boolean
  children: React.ReactNode
  to: string
  handleExpandParent: () => void
}

export const SidebarItemCollapsable: React.FC<SidebarItemCollapsableProps> = ({
  children,
  icon: StartIcon,
  isExpanded,
  isSelected,
  handleExpandParent: handleSelectedRootItem,
  divider,
  collapsed,
  label,
  notification,
  to,
}) => {
  const getComponentType = () => {
    if (!collapsed) {
      return 'button'
    }
    return Link
  }

  const getNavigationLink = () => {
    if (!collapsed) {
      return undefined
    }
    return to
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          component={getComponentType()}
          selected={isSelected}
          to={getNavigationLink()}
          onClick={handleSelectedRootItem}
          sx={
            !collapsed && isSelected
              ? {
                  '&.Mui-selected': {
                    backgroundColor: 'transparent',
                  },

                  border: 'none',
                  backgroundColor: 'transparent',
                }
              : undefined
          }
        >
          <Stack direction="row" sx={{ flexGrow: 1, paddingLeft: 2 }}>
            <SidebarRootIcon tooltipLabel={label} Icon={StartIcon} notification={notification} />
            {!collapsed && (
              <ListItemText
                disableTypography
                primary={
                  <Typography fontWeight={600} color="inherit">
                    {label}
                  </Typography>
                }
              />
            )}
            {!collapsed && (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
          </Stack>
        </ListItemButton>
      </ListItem>
      {divider && <Divider sx={{ mb: 2 }} />}
      {!collapsed && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List disablePadding>{children}</List>
        </Collapse>
      )}
    </>
  )
}
