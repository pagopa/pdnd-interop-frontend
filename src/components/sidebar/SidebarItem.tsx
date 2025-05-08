import React from 'react'
import { ListItem, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material'
import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { useGetRouteLabel } from './SidebarItemRoot'
import { BadgeNotification } from './BadgeNotification'
import type { Notification } from './sidebar.types'
import { sidebarStyles } from './sidebar.styles'
import type { RouteKey } from '@/router'
import { Link } from 'react-router-dom'

type PolymorphicProps<C extends ElementType, P = {}> = P & { component?: C } & Omit<
    ComponentPropsWithoutRef<C>,
    keyof P | 'component'
  >

export type SidebarItemProps<C extends ElementType = 'a'> = PolymorphicProps<
  C,
  {
    typographyProps?: ComponentPropsWithoutRef<typeof Typography>
    isActive?: boolean
    disabled?: boolean
    collapsed: boolean
    to: RouteKey
    label?: string
    notification?: Notification
  }
>

export function SidebarItem<C extends ElementType = 'a'>({
  isActive,
  component,
  disabled,
  typographyProps,
  collapsed,
  to,
  label,
  notification,
  ...props
}: SidebarItemProps<C>) {
  const theme = useTheme()
  const styles = sidebarStyles(theme, collapsed)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routeLabel = label ? label : useGetRouteLabel(to)
  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemButton
        component={Link}
        to={to}
        disabled={disabled}
        sx={styles.itemButtonActive}
        {...props}
      >
        <ListItemText
          disableTypography
          sx={{ color: 'inherit', marginLeft: 7 }}
          primary={
            <Typography
              color="inherit"
              {...typographyProps}
              sx={{
                fontWeight: isActive ? 600 : 300,
                ...typographyProps?.sx,
              }}
            >
              {routeLabel}
            </Typography>
          }
        />
        {notification && <BadgeNotification badgeContent={notification.content} />}
      </ListItemButton>
    </ListItem>
  )
}
