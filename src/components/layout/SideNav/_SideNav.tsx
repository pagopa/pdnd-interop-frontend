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
import { AuthHooks, jwtQueryOptions } from '@/api/auth'
import { getCurrentSelfCareProductId } from '@/utils/common.utils'
import { useSuspenseQuery } from '@tanstack/react-query'

export const SideNav = () => {
  const { t } = useTranslation('shared-components')

  const {
    data: { isAdmin, jwt },
  } = useSuspenseQuery(jwtQueryOptions())

  const selfcareUsersPageUrl =
    jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/users#${getCurrentSelfCareProductId()}`

  const selfcareGroupsPageUrl = jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/groups`

  return (
    <Box sx={{ display: 'block', py: 3, boxShadow: 5 }} component="nav">
      <List sx={{ width: SIDENAV_WIDTH, mr: 0 }} disablePadding></List>
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
