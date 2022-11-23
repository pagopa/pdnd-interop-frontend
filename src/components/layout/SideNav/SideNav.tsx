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
import EmailIcon from '@mui/icons-material/Email'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import PeopleIcon from '@mui/icons-material/People'
import { useTranslation } from 'react-i18next'
import { RouteKey } from '@/router/types'
import { UserProductRole } from '@/types/party.types'
import { useJwt } from '@/hooks/useJwt'
import { SELFCARE_BASE_URL } from '@/config/env'
import { useCurrentRoute } from '@/router'
import { getParentRoutes } from '@/router/utils'
import { SIDENAV_WIDTH } from '@/config/constants'
import { SideNavItemLink, SideNavItemLinkSkeleton } from './SideNavItemLink'
import { CollapsableSideNavItem, CollapsableSideNavItemSkeleton } from './CollapsableSideNavItem'

type View = {
  routeKey: RouteKey
  id?: string
  children?: Array<RouteKey>
}

export type SideNavItemView = View & {
  StartIcon?: SvgIconComponent
  EndIcon?: SvgIconComponent
}

type Views = Record<UserProductRole, Array<SideNavItemView>>

const views: Views = {
  admin: [
    {
      routeKey: 'PROVIDE',
      id: 'provider',
      children: ['PROVIDE_ESERVICE_LIST', 'PROVIDE_AGREEMENT_LIST'],
    },
    {
      routeKey: 'SUBSCRIBE',
      id: 'subscriber',
      children: [
        'SUBSCRIBE_CATALOG_LIST',
        'SUBSCRIBE_AGREEMENT_LIST',
        'SUBSCRIBE_PURPOSE_LIST',
        'SUBSCRIBE_CLIENT_LIST',
        'SUBSCRIBE_INTEROP_M2M',
      ],
    },
  ],
  api: [
    {
      routeKey: 'PROVIDE',
      id: 'provider',
      children: ['PROVIDE_ESERVICE_LIST'],
    },
    {
      routeKey: 'SUBSCRIBE',
      id: 'subscriber',
      children: ['SUBSCRIBE_CATALOG_LIST'],
    },
  ],
  security: [
    {
      routeKey: 'SUBSCRIBE',
      id: 'subscriber',
      children: ['SUBSCRIBE_CATALOG_LIST', 'SUBSCRIBE_CLIENT_LIST', 'SUBSCRIBE_INTEROP_M2M'],
    },
  ],
}

export const SideNav = () => {
  const { jwt } = useJwt()
  if (!jwt) return <SideNavSkeleton />
  return <_SideNav />
}

const _SideNav = () => {
  const { t } = useTranslation('shared-components')
  const { jwt, isAdmin, isOperatorAPI, isOperatorSecurity } = useJwt()
  const { routeKey } = useCurrentRoute()

  const availableViews: Array<SideNavItemView> = React.useMemo(
    () => [
      ...(isAdmin ? views['admin'] : []),
      ...(isOperatorAPI ? views['api'] : []),
      ...(isOperatorSecurity ? views['security'] : []),
      { routeKey: 'NOTIFICATION', StartIcon: EmailIcon },
      ...(isAdmin ? [{ routeKey: 'PARTY_REGISTRY' as RouteKey }] : []),
    ],
    [isAdmin, isOperatorAPI, isOperatorSecurity]
  )

  const isActive = () => {
    const parentRoutes: Array<RouteKey> = [...getParentRoutes(routeKey), routeKey]

    const menuRoutes = availableViews.filter((view) => 'id' in view)
    const menuId = menuRoutes.find(({ routeKey }) => parentRoutes.includes(routeKey))?.id ?? null

    return menuId
  }

  const [openId, setOpenId] = useState<string | null>(isActive)

  const selfcareUsersPageUrl =
    jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/users#prod-interop`

  const toggleCollapse = (id: string | undefined) => {
    setOpenId((prev) => (id === prev ? null : !id ? null : id))
  }

  return (
    <Box sx={{ display: 'block', py: 3, boxShadow: 5 }} component="nav">
      <List sx={{ width: SIDENAV_WIDTH, mr: 0 }} disablePadding>
        {availableViews.map((item, i) => {
          return item?.children && item?.children?.length > 0 ? (
            <CollapsableSideNavItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              toggleCollapse={toggleCollapse}
            />
          ) : (
            <ListItem sx={{ display: 'block', p: 0 }} key={i}>
              <SideNavItemLink
                routeKey={item.routeKey}
                StartIcon={item?.StartIcon}
                EndIcon={item?.EndIcon}
              />
            </ListItem>
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
                target={selfcareUsersPageUrl && '_blank'}
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
          </List>
        </>
      )}
    </Box>
  )
}

const SideNavSkeleton: React.FC = () => {
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
