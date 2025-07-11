import React from 'react'
import { ListItem, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material'
import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { BadgeNotification } from './BadgeNotification'
import type { Notification } from './sidebar.types'
import { sidebarStyles } from './sidebar.styles'
import type { SvgIconComponent } from '@mui/icons-material'
import { SidebarRootIcon } from './SidebarItemRootIcon'

type PolymorphicProps<C extends ElementType, P = {}> = P & { component?: C } & Omit<
    ComponentPropsWithoutRef<C>,
    keyof P | 'component'
  >

export type SidebarItemLinkProps<C extends ElementType = 'a'> = PolymorphicProps<
  C,
  {
    Icon?: SvgIconComponent
    typographyProps?: ComponentPropsWithoutRef<typeof Typography>
    disabled?: boolean
    collapsed: boolean
    label: string
    notification?: Notification
    isSelected?: boolean
  }
>

export function SidebarItemLink<C extends ElementType = 'a'>({
  isSelected,
  component,
  Icon,
  disabled,
  typographyProps,
  collapsed,
  label,
  notification,
  ...props
}: SidebarItemLinkProps<C>) {
  const theme = useTheme()
  const styles = sidebarStyles(theme, collapsed)

  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemButton
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
        {Icon && <SidebarRootIcon tooltipLabel={label} Icon={Icon} notification={notification} />}

        {!collapsed && (
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
      </ListItemButton>
    </ListItem>
  )
}
