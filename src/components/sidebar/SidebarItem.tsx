import React from 'react'
import { ListItem, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material'
import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { useGetRouteLabel } from './SidebarItemRoot'
import { BadgeNotification } from './BadgeNotification'
import type { Notification } from './sidebar.types'
import { sidebarStyles } from './sidebar.styles'
import { useGeneratePath, type RouteKey } from '@/router'
import { Link } from 'react-router-dom'
import { useIsRouteInCurrentSubtree } from '../layout/SideNav/hooks/useIsRouteInCurrentSubtree'

type PolymorphicProps<C extends ElementType, P = {}> = P & { component?: C } & Omit<
    ComponentPropsWithoutRef<C>,
    keyof P | 'component'
  >

export type SidebarItemProps<C extends ElementType = 'a'> = PolymorphicProps<
  C,
  {
    typographyProps?: ComponentPropsWithoutRef<typeof Typography>
    disabled?: boolean
    collapsed: boolean
    routeKey: RouteKey
    label?: string
    notification?: Notification
  }
>

export function SidebarItem<C extends ElementType = 'a'>({
  disabled,
  typographyProps,
  collapsed,
  label,
  notification,
  routeKey,
  ...props
}: SidebarItemProps<C>) {
  const theme = useTheme()
  const styles = sidebarStyles(theme, collapsed)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routeLabel = label ? label : useGetRouteLabel(routeKey)

  const isRouteInCurrentSubtree = useIsRouteInCurrentSubtree()
  const generatePath = useGeneratePath()

  const isSelected = isRouteInCurrentSubtree(routeKey)

  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemButton
        to={generatePath(routeKey)}
        sx={{
          ...(isSelected && styles.itemButtonActive),
        }}
        selected={isSelected}
        component={Link}
        disabled={disabled}
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
                fontWeight: isSelected ? 600 : 300,
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
