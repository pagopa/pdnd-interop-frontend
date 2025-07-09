import React from 'react'
import { ListItem, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material'
import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { useGetRouteLabel } from './SidebarItemCollapsable'
import { BadgeNotification } from './BadgeNotification'
import type { Notification } from './sidebar.types'
import { sidebarStyles } from './sidebar.styles'
import { type RouteKey } from '@/router'
import type { SvgIconComponent } from '@mui/icons-material'
import { SidebarRootIcon } from './SidebarItemRootIcon'

type PolymorphicProps<C extends ElementType, P = {}> = P & { component?: C } & Omit<
    ComponentPropsWithoutRef<C>,
    keyof P | 'component'
  >

export type SidebarItemChild<C extends ElementType = 'a'> = PolymorphicProps<
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
  to,
  ...props
}: SidebarItemChild<C>) {
  const theme = useTheme()
  const styles = sidebarStyles(theme, collapsed)

  return (
    <ListItem sx={{ p: 0, pl: 2 }}>
      <ListItemButton
        component={component}
        to={to}
        sx={{
          ...(isSelected && styles.itemButtonActive),
        }}
        selected={isSelected}
        disabled={disabled}
        {...props}
      >
        {Icon && <SidebarRootIcon tooltipLabel={label} Icon={Icon} notification={notification} />}

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
        {notification && <BadgeNotification badgeContent={notification.content} />}
      </ListItemButton>
    </ListItem>
  )
}
