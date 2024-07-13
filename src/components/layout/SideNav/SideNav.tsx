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
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import PeopleIcon from '@mui/icons-material/People'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import { useTranslation } from 'react-i18next'
import { SELFCARE_BASE_URL } from '@/config/env'
import { SIDENAV_WIDTH } from '@/config/constants'
import { SideNavItemLink, SideNavItemLinkSkeleton } from './SideNavItemLink'
import { CollapsableSideNavItem, CollapsableSideNavItemSkeleton } from './CollapsableSideNavItem'
import { getCurrentSelfCareProductId } from '@/utils/common.utils'
import { useLocation } from '@tanstack/react-router'
import { P, match } from 'ts-pattern'
import { PartyQueries } from '@/api/party'
import { useCurrentRoute } from '@/router'
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser'
import { isCertifier } from '@/utils/tenant.utils'

export const SideNav = () => {
  const { t } = useTranslation('shared-components')

  const currentPath = useLocation().pathname
  const [openSubNav, setOpenSubNav] = useState<string | undefined>(() =>
    match(currentPath)
      .with(P.string.includes('/fruizione/'), () => '/fruizione')
      .with(P.string.includes('/erogazione/'), () => '/erogazione')
      .with(P.string.includes('/aderente/'), () => '/aderente')
      .otherwise(() => undefined)
  )

  const { selfcareId, isOrganizationAllowedToProduce, isSupport, isAdmin } = useAuthenticatedUser()

  const { data: tenant } = PartyQueries.useGetActiveUserParty()

  const selfcareUsersPageUrl = `${SELFCARE_BASE_URL}/dashboard/${selfcareId}/users#${getCurrentSelfCareProductId()}`
  const selfcareGroupsPageUrl = `${SELFCARE_BASE_URL}/dashboard/${selfcareId}/groups`

  return (
    <Box sx={{ display: 'block', py: 3, boxShadow: 5 }} component="nav">
      <List sx={{ width: SIDENAV_WIDTH, mr: 0 }} disablePadding>
        <CollapsableSideNavItem
          subpath="/fruizione"
          isOpen={openSubNav === '/fruizione'}
          onToggle={setOpenSubNav}
        >
          <SideNavItemLink to="/fruizione/catalogo-e-service" indented />
          <SideNavItemLink to="/fruizione/richieste" indented />
          <SideNavItemLink to="/fruizione/finalita" indented />
          <SideNavItemLink to="/fruizione/client" indented />
          <SideNavItemLink to="/fruizione/interop-m2m" indented />
          <SideNavItemLink to="/fruizione/debug-voucher" indented />
        </CollapsableSideNavItem>
        {(isOrganizationAllowedToProduce || isSupport) && (
          <CollapsableSideNavItem
            subpath="/erogazione"
            isOpen={openSubNav === '/erogazione'}
            onToggle={setOpenSubNav}
          >
            <SideNavItemLink to="/erogazione/e-service" indented />
            <SideNavItemLink to="/erogazione/richieste" indented />
            <SideNavItemLink to="/erogazione/finalita" indented />
          </CollapsableSideNavItem>
        )}
        <CollapsableSideNavItem
          subpath="/aderente"
          isOpen={openSubNav === '/aderente'}
          onToggle={setOpenSubNav}
        >
          <SideNavItemLink to="/aderente/anagrafica" indented />
          {isCertifier(tenant) && <SideNavItemLink to="/aderente/certificatore" indented />}
        </CollapsableSideNavItem>
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
  const { mode } = useCurrentRoute()

  return (
    <Box sx={{ display: 'block', py: 3, boxShadow: 5 }} component="nav">
      <List sx={{ width: SIDENAV_WIDTH, mr: 0 }} disablePadding>
        {match(mode)
          .with('consumer', () => (
            <>
              <CollapsableSideNavItemSkeleton>
                <SideNavItemLinkSkeleton />
                <SideNavItemLinkSkeleton />
                <SideNavItemLinkSkeleton />
                <SideNavItemLinkSkeleton />
                <SideNavItemLinkSkeleton />
              </CollapsableSideNavItemSkeleton>
              <CollapsableSideNavItemSkeleton />
              <CollapsableSideNavItemSkeleton />
            </>
          ))
          .with('provider', () => (
            <>
              <CollapsableSideNavItemSkeleton />
              <CollapsableSideNavItemSkeleton>
                <SideNavItemLinkSkeleton />
                <SideNavItemLinkSkeleton />
                <SideNavItemLinkSkeleton />
              </CollapsableSideNavItemSkeleton>
              <CollapsableSideNavItemSkeleton />
            </>
          ))
          .with(null, () => (
            <>
              <CollapsableSideNavItemSkeleton />
              <CollapsableSideNavItemSkeleton />
              <CollapsableSideNavItemSkeleton>
                <SideNavItemLinkSkeleton />
                <SideNavItemLinkSkeleton />
              </CollapsableSideNavItemSkeleton>
            </>
          ))
          .exhaustive()}
      </List>
      <Divider sx={{ my: 1 }} />
      <List sx={{ width: SIDENAV_WIDTH, mr: 0 }}>
        <SideNavItemLinkSkeleton />
        <SideNavItemLinkSkeleton />
      </List>
    </Box>
  )
}
