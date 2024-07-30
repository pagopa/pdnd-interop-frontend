import React, { useState } from 'react'
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import PeopleIcon from '@mui/icons-material/People'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import { useTranslation } from 'react-i18next'
import { SELFCARE_BASE_URL } from '@/config/env'
import { type RouteKey, useCurrentRoute, getParentRoutes } from '@/router'
import { SIDENAV_WIDTH } from '@/config/constants'
import { SideNavItemLink, SideNavItemLinkSkeleton } from './SideNavItemLink'
import { CollapsableSideNavItem, CollapsableSideNavItemSkeleton } from './CollapsableSideNavItem'
import { useGetSideNavItems } from './hooks/useGetSideNavItems'
import { AuthHooks } from '@/api/auth'
import { getCurrentSelfCareProductId } from '@/utils/common.utils'

type View = {
  routeKey: RouteKey
  id?: string
  children?: Array<RouteKey>
}

export type SideNavItemView = View & {
  StartIcon?: SvgIconComponent
  EndIcon?: SvgIconComponent
}

export const SideNav = () => {
  const { jwt } = AuthHooks.useJwt()
  if (!jwt) return <SideNavSkeleton />
  return <_SideNav />
}

const _SideNav = () => {
  const { t } = useTranslation('shared-components')
  const { jwt, isAdmin } = AuthHooks.useJwt()
  const { routeKey } = useCurrentRoute()

  const sideNavItems = useGetSideNavItems()

  const isActive = () => {
    const parentRoutes: Array<RouteKey> = [...getParentRoutes(routeKey), routeKey]

    const menuRoutes = sideNavItems.filter((view) => 'id' in view)
    const menuId = menuRoutes.find(({ routeKey }) => parentRoutes.includes(routeKey))?.id ?? null

    return menuId
  }

  const [openId, setOpenId] = useState<string | null>(isActive)

  const selfcareUsersPageUrl =
    jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/users#${getCurrentSelfCareProductId()}`

  const selfcareGroupsPageUrl = jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/groups`

  const toggleCollapse = (id: string | undefined) => {
    setOpenId((prev) => (id === prev ? null : !id ? null : id))
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 360,
        backgroundColor: 'background.paper',
      }}
    >
      <List component="nav">
        {sideNavItems.map((item, i) => {
          return item?.children && item?.children?.length > 0 ? (
            <CollapsableSideNavItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              toggleCollapse={toggleCollapse}
            />
          ) : (
            <SideNavItemLink
              routeKey={item.routeKey}
              StartIcon={item?.StartIcon}
              EndIcon={item?.EndIcon}
              key={i}
            />
          )
        })}
      </List>
      {isAdmin && (
        <>
          <Divider sx={{ my: 1 }} />
          <List sx={{ width: SIDENAV_WIDTH, mr: 0 }}>
            <ListItem sx={{ display: 'block', p: 0 }}>
              <ListItemButton
                component="a"
                href={selfcareUsersPageUrl}
                target="_blank"
                sx={{
                  pl: 3,
                  py: 2,
                  display: 'flex',
                }}
              >
                <ListItemIcon>
                  <PeopleIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary={t('sidenav.userExternalLinkLabel')} />
                <ListItemIcon>
                  <ExitToAppRoundedIcon color="action" />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem sx={{ display: 'block', p: 0 }}>
              <ListItemButton
                component="a"
                href={selfcareGroupsPageUrl}
                target="_blank"
                sx={{
                  pl: 3,
                  py: 2,
                  display: 'flex',
                }}
              >
                <ListItemIcon>
                  <SupervisedUserCircleIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary={t('sidenav.groupsExternalLinkLabel')} />
                <ListItemIcon>
                  <ExitToAppRoundedIcon color="action" />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  )
}

export const SideNavSkeleton: React.FC = () => {
  return (
    <Box sx={{ display: 'block', py: 3, boxShadow: 5 }} component="nav">
      <List sx={{ width: SIDENAV_WIDTH, mr: 0 }} disablePadding>
        <CollapsableSideNavItemSkeleton />
        <CollapsableSideNavItemSkeleton>
          <SideNavItemLinkSkeleton />
          <SideNavItemLinkSkeleton />
          <SideNavItemLinkSkeleton />
          <SideNavItemLinkSkeleton />
          <SideNavItemLinkSkeleton />
        </CollapsableSideNavItemSkeleton>
        <SideNavItemLinkSkeleton />
        <SideNavItemLinkSkeleton />
      </List>
      <Divider sx={{ my: 1 }} />
      <List sx={{ width: SIDENAV_WIDTH, mr: 0 }}>
        <SideNavItemLinkSkeleton />
      </List>
    </Box>
  )
}
