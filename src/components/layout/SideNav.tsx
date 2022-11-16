import React, { useState } from 'react'
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { SvgIconComponent } from '@mui/icons-material'
import EmailIcon from '@mui/icons-material/Email'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import PeopleIcon from '@mui/icons-material/People'
import { useTranslation } from 'react-i18next'
import { RouteKey } from '@/router/types'
import { UserProductRole } from '@/types/party.types'
import { useJwt } from '@/hooks/useJwt'
import { routes } from '@/router/routes'
import { SELFCARE_BASE_URL } from '@/config/env'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { RouterLink, useCurrentRoute } from '@/router'
import { getParentRoutes } from '@/router/utils'

type View = {
  routeKey: RouteKey
  id?: string
  children?: Array<RouteKey>
}

type SideNavItemView = View & {
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

const WIDTH = 340

export const SideNav = () => {
  const { t } = useTranslation('shared-components')
  const { jwt, isAdmin, isOperatorAPI, isOperatorSecurity } = useJwt()
  const { routeKey } = useCurrentRoute()

  const availableViews: Array<SideNavItemView> = [
    ...(isAdmin ? views['admin'] : []),
    ...(isOperatorAPI ? views['api'] : []),
    ...(isOperatorSecurity ? views['security'] : []),
    { routeKey: 'NOTIFICATION', StartIcon: EmailIcon },
  ]

  const isActive = () => {
    const parentRoutes: Array<RouteKey> = [...getParentRoutes(routeKey), routeKey]

    const menuRoutes = availableViews.filter((view) => 'id' in view)
    const menuId = menuRoutes.find(({ routeKey }) => parentRoutes.includes(routeKey))?.id ?? null

    return menuId
  }

  const [openId, setOpenId] = useState<string | null>(isActive)

  const selfcareUsersPageUrl =
    jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/users#prod-interop`

  if (isAdmin) {
    availableViews.push({ routeKey: 'PARTY_REGISTRY' })
  }

  const toggleCollapse = (id: string | undefined) => {
    setOpenId((prev) => (id === prev ? null : !id ? null : id))
  }

  return (
    <Box sx={{ display: 'block', py: 3, boxShadow: 5 }} component="nav">
      {jwt && (
        <List sx={{ width: WIDTH, mr: 0 }} disablePadding>
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
      )}
      {isAdmin && (
        <>
          <Divider sx={{ my: 1 }} />
          <List sx={{ width: WIDTH, mr: 0 }}>
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

type CollapsableSideNavItemProps = {
  item: SideNavItemView
  isOpen: boolean
  toggleCollapse: (id: string | undefined) => void
}

const CollapsableSideNavItem: React.FC<CollapsableSideNavItemProps> = ({
  item,
  isOpen,
  toggleCollapse,
}) => {
  const currentLanguage = useCurrentLanguage()
  const { isRouteInCurrentSubtree } = useCurrentRoute()

  const route = routes[item.routeKey]
  const isSelected = item.children?.some(isRouteInCurrentSubtree)

  const handleToggleCollapse = () => {
    toggleCollapse(item.id)
  }

  return (
    <Box color={isSelected ? 'primary.main' : 'text.primary'}>
      <ListItemButton sx={{ pl: 3 }} color="inherit" onClick={handleToggleCollapse}>
        <ListItemText
          sx={{ color: 'inherit' }}
          disableTypography
          primary={
            <Typography color="inherit" sx={{ fontWeight: isSelected ? 600 : 300 }}>
              {route.LABEL[currentLanguage]}
            </Typography>
          }
        />
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding sx={{ width: WIDTH }}>
          {item &&
            item.children &&
            item.children.map((child, j) => (
              <ListItem sx={{ display: 'block', p: 0 }} key={j}>
                <SideNavItemLink routeKey={child} indented />
              </ListItem>
            ))}
        </List>
      </Collapse>
    </Box>
  )
}

type SideNavItemLinkProps = {
  routeKey: RouteKey
  StartIcon?: SvgIconComponent
  EndIcon?: SvgIconComponent
  indented?: boolean
}

const SideNavItemLink: React.FC<SideNavItemLinkProps> = ({
  routeKey,
  StartIcon,
  EndIcon,
  indented = false,
}) => {
  const currentLanguage = useCurrentLanguage()
  const { isRouteInCurrentSubtree } = useCurrentRoute()
  const route = routes[routeKey]
  const label = route.LABEL[currentLanguage]
  const isSelected = isRouteInCurrentSubtree(routeKey)

  return (
    <ListItemButton
      component={RouterLink}
      underline="none"
      to={routeKey}
      sx={{
        pl: 3,
        py: 2,
        display: 'flex',
        borderRight: 2,
        borderColor: isSelected ? 'primary.main' : 'transparent',
        backgroundColor: isSelected ? 'rgba(0, 115, 230, 0.08)' : 'transparent',
        color: isSelected ? 'primary.main' : 'text.primary',
      }}
    >
      {StartIcon && (
        <ListItemIcon>
          <StartIcon fontSize="inherit" color={isSelected ? 'primary' : undefined} />
        </ListItemIcon>
      )}
      <ListItemText
        disableTypography
        sx={{ color: 'inherit' }}
        primary={
          <Typography
            color="inherit"
            sx={{ fontWeight: isSelected ? 600 : 300, pl: indented ? 4 : 0 }}
          >
            {label}
          </Typography>
        }
      />
      {EndIcon && (
        <ListItemIcon>
          <EndIcon color="action" />
        </ListItemIcon>
      )}
    </ListItemButton>
  )
}
