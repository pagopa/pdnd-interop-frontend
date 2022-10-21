import React, { useState } from 'react'
import { useLocation } from 'react-router'
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconTypeMap,
  Typography,
} from '@mui/material'
import { MappedRouteConfig, UserProductRole } from '../../types'
import { StyledLink } from './Shared/StyledLink'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { useRoute } from '../hooks/useRoute'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'
import { LoadingTranslations } from './Shared/LoadingTranslations'
import { Email as EmailIcon } from '@mui/icons-material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

type View = {
  route: MappedRouteConfig
  id?: string
  children?: Array<MappedRouteConfig>
}

type MuiIcon = OverridableComponent<SvgIconTypeMap<unknown, 'svg'>> & {
  muiName: string
}

type SideNavItemView = View & {
  StartIcon?: MuiIcon
  EndIcon?: MuiIcon
}

type Views = Record<UserProductRole, Array<SideNavItemView>>

const WIDTH = 340

export const MainNav = () => {
  const { jwt, isAdmin, isOperatorAPI, isOperatorSecurity } = useJwt()
  const location = useLocation()
  const [openId, setOpenId] = useState<string | null>(null)
  const { isRouteInTree } = useRoute()
  const { routes } = useRoute()

  const views: Views = {
    admin: [
      {
        route: routes.PROVIDE,
        id: 'provider',
        children: [routes.PROVIDE_ESERVICE_LIST, routes.PROVIDE_AGREEMENT_LIST],
      },
      {
        route: routes.SUBSCRIBE,
        id: 'subscriber',
        children: [
          routes.SUBSCRIBE_CATALOG_LIST,
          routes.SUBSCRIBE_AGREEMENT_LIST,
          routes.SUBSCRIBE_PURPOSE_LIST,
          routes.SUBSCRIBE_CLIENT_LIST,
          routes.SUBSCRIBE_INTEROP_M2M,
        ],
      },
      { route: routes.PARTY_REGISTRY },
    ],
    api: [
      {
        route: routes.PROVIDE,
        id: 'provider',
        children: [routes.PROVIDE_ESERVICE_LIST],
      },
    ],
    security: [
      {
        route: routes.SUBSCRIBE,
        id: 'subscriber',
        children: [
          routes.SUBSCRIBE_CATALOG_LIST,
          routes.SUBSCRIBE_CLIENT_LIST,
          routes.SUBSCRIBE_INTEROP_M2M,
        ],
      },
    ],
  }

  const availableViews = [
    ...(isAdmin ? views['admin'] : []),
    ...(isOperatorAPI ? views['api'] : []),
    ...(isOperatorSecurity ? views['security'] : []),
    { route: routes.NOTIFICATION, StartIcon: EmailIcon },
  ]

  const wrapSetOpenSubmenuId = (newOpenId?: string) => () => {
    setOpenId(newOpenId && newOpenId !== openId ? newOpenId : null)
  }

  const isItemSelected = (route: MappedRouteConfig) => {
    return isRouteInTree(location, route)
  }

  return (
    <MainNavComponent
      items={availableViews}
      isItemSelected={isItemSelected}
      openSubmenuId={openId}
      wrapSetOpenSubmenuId={wrapSetOpenSubmenuId}
      shouldRender={Boolean(jwt)}
    />
  )
}

type MainNavComponentProps = {
  items: Array<SideNavItemView>
  isItemSelected: (route: MappedRouteConfig) => boolean
  openSubmenuId: string | null
  wrapSetOpenSubmenuId: (id?: string) => () => void
  shouldRender: boolean
}

const MainNavComponent = ({
  items,
  isItemSelected,
  openSubmenuId,
  wrapSetOpenSubmenuId,
  shouldRender,
}: MainNavComponentProps) => {
  const { t, ready } = useTranslation('common', { useSuspense: false })

  const WrappedLink = ({
    route,
    StartIcon,
    EndIcon,
    indented = false,
  }: {
    route: MappedRouteConfig
    StartIcon?: MuiIcon
    EndIcon?: MuiIcon
    indented?: boolean
  }) => {
    const isSelected = isItemSelected(route)
    const { PATH, LABEL } = route
    return (
      <ListItemButton
        component={StyledLink}
        underline="none"
        to={PATH}
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
              {LABEL}
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

  if (!ready) {
    return <LoadingTranslations />
  }

  return (
    <Box sx={{ display: 'block', py: 3, boxShadow: 5 }} component="nav">
      {shouldRender && (
        <List sx={{ width: WIDTH }} aria-label={t('mainNav')} disablePadding>
          {items.map((item, i) => {
            const isSubmenuOpen = openSubmenuId === item.id
            const isSelected = isItemSelected(item.route)

            return !!item.children && Boolean(item.children.length > 0) ? (
              <Box key={i} color={isSelected ? 'primary.main' : 'text.primary'}>
                <ListItemButton
                  sx={{ pl: 3 }}
                  color="inherit"
                  onClick={wrapSetOpenSubmenuId(item.id)}
                >
                  <ListItemText
                    sx={{ color: 'inherit' }}
                    disableTypography
                    primary={
                      <Typography color="inherit" sx={{ fontWeight: isSelected ? 600 : 300 }}>
                        {item.route.LABEL}
                      </Typography>
                    }
                  />
                  {isSubmenuOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ width: WIDTH }}>
                    {(item.children as Array<MappedRouteConfig>).map((child, j) => (
                      <ListItem sx={{ display: 'block', p: 0 }} key={j}>
                        <WrappedLink route={child} indented />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ) : (
              <ListItem sx={{ display: 'block', p: 0 }} key={i}>
                <WrappedLink
                  route={item.route}
                  StartIcon={item?.StartIcon}
                  EndIcon={item?.EndIcon}
                />
              </ListItem>
            )
          })}
        </List>
      )}
    </Box>
  )
}
