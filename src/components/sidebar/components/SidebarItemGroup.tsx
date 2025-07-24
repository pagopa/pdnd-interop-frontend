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
import type { Notification } from '../sidebar.types'
import { SidebarIcon } from '../SidebarIcon'
import { useSidebarContext } from './Sidebar'

type SidebarItemGroupProps = {
  notification?: Notification
  label: string
  isExpanded: boolean
  isSelected: boolean
  icon: SvgIconComponent
  divider?: boolean
  children: React.ReactNode
  handleExpandParent: () => void
  renderOnCollapsed: React.ReactNode
}

export const SidebarItemGroup: React.FC<SidebarItemGroupProps> = ({
  children,
  icon: StartIcon,
  isExpanded,
  isSelected,
  handleExpandParent: handleSelectedRootItem,
  divider,
  label,
  notification,
  renderOnCollapsed,
}) => {
  const { isCollapsed } = useSidebarContext()

  return !isCollapsed ? (
    <>
      <ListItem disablePadding>
        <ListItemButton
          selected={isSelected}
          onClick={handleSelectedRootItem}
          sx={
            !isCollapsed && isSelected
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
            <SidebarIcon Icon={StartIcon} notification={notification} />
            {!isCollapsed && (
              <ListItemText
                disableTypography
                primary={
                  <Typography fontWeight={600} color="inherit">
                    {label}
                  </Typography>
                }
              />
            )}
            {!isCollapsed && (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
          </Stack>
        </ListItemButton>
      </ListItem>
      {divider && <Divider sx={{ mb: 2 }} />}
      {!isCollapsed && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List disablePadding>{children}</List>
        </Collapse>
      )}
    </>
  ) : (
    renderOnCollapsed
  )
}
