import React from 'react'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { BadgeNotification } from './BadgeNotification'
import type { Notification } from '../sidebar.types'
import { sidebarStyles } from '../sidebar.styles'
import type { SvgIconComponent } from '@mui/icons-material'
import { SidebarIcon } from './SidebarIcon'
import { useSidebarContext } from './Sidebar'

type PolymorphicProps<C extends ElementType, P = {}> = P & { component?: C } & Omit<
    ComponentPropsWithoutRef<C>,
    keyof P | 'component'
  >

export type SidebarItem<C extends ElementType = 'a'> = PolymorphicProps<
  C,
  {
    StartIcon?: SvgIconComponent
    EndIcon?: SvgIconComponent
    typographyProps?: ComponentPropsWithoutRef<typeof Typography>
    disabled?: boolean
    label: string
    notification?: Notification
    isSelected?: boolean
  }
>

export function SidebarItem<C extends ElementType = 'a'>({
  isSelected,
  component,
  StartIcon,
  EndIcon,
  disabled,
  typographyProps,
  label,
  notification,
  ...props
}: SidebarItem<C>) {
  const theme = useTheme()

  const { open } = useSidebarContext()

  const styles = sidebarStyles(theme, open)

  return (
    <ListItem data-testid={label} sx={{ p: 0 }}>
      <Tooltip data-testid="sidebar-icon" title={label} placement="right">
        <ListItemButton
          aria-selected={isSelected}
          component={component ?? 'a'}
          to={props.to}
          sx={{
            pl: 4,
            ...(isSelected && styles.itemButtonActive),
          }}
          selected={isSelected}
          disabled={disabled}
          {...props}
        >
          {StartIcon && <SidebarIcon Icon={StartIcon} notification={notification} />}

          {!open && (
            <ListItemText
              disableTypography
              sx={{ color: 'inherit', marginLeft: 7 }}
              primary={
                <Typography
                  color="inherit"
                  {...typographyProps}
                  sx={{
                    fontWeight: 600,
                    ...typographyProps?.sx,
                  }}
                >
                  {label}
                </Typography>
              }
            />
          )}
          {notification && <BadgeNotification badgeContent={notification.content} />}
          {!open && EndIcon && (
            <ListItemIcon>
              <EndIcon data-testid="itemlink-end-icon" fontSize="inherit" color="action" />
            </ListItemIcon>
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  )
}
