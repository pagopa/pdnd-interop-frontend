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
import { SidebarIcon } from './SidebarIcon'
import { useSidebarContext } from './Sidebar'

type SidebarItemGroupProps = {
  notification?: number
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
  handleExpandParent,
  divider,
  label,
  notification,
  renderOnCollapsed,
}) => {
  const { open } = useSidebarContext()

  return open ? (
    <>
      <ListItem disablePadding>
        <ListItemButton
          data-testid="sidebar-item-group-button"
          selected={isSelected}
          onClick={handleExpandParent}
          sx={
            !open && isSelected
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
            {open && (
              <>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography fontWeight={600} color="inherit">
                      {label}
                    </Typography>
                  }
                />
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </>
            )}
          </Stack>
        </ListItemButton>
      </ListItem>
      {divider && <Divider data-testid="sidebar-item-group-divider" sx={{ mb: 2 }} />}
      {open && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List disablePadding>{children}</List>
        </Collapse>
      )}
    </>
  ) : (
    renderOnCollapsed
  )
}
