import React, { useContext, useState } from 'react'
import { useLocation } from 'react-router'
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { MappedRouteConfig, UserProductRole } from '../../types'
import { PartyContext, TokenContext } from '../lib/context'
import { StyledLink } from './Shared/StyledLink'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { useRoute } from '../hooks/useRoute'

type View = {
  route: MappedRouteConfig
  id?: string
  children?: Array<MappedRouteConfig>
}

type Views = Record<UserProductRole, Array<View>>

const WIDTH = 340

export const MainNav = () => {
  const { token } = useContext(TokenContext)
  const { party } = useContext(PartyContext)
  const location = useLocation()
  const [openId, setOpenId] = useState<string | null>(null)
  const { isRouteInTree } = useRoute()
  const { routes } = useRoute()

  const views: Views = {
    admin: [
      {
        route: routes.PROVIDE,
        id: 'provider',
        children: [
          routes.PROVIDE_ESERVICE_LIST,
          routes.PROVIDE_AGREEMENT_LIST,
          routes.PROVIDE_OPERATOR_LIST,
        ],
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
    ...views[party?.productInfo.role || 'security'],
    { route: routes.NOTIFICATION },
    { route: routes.HELP },
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
      shouldRender={Boolean(token)}
    />
  )
}

type MainNavComponentProps = {
  items: Array<View>
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
  const WrappedLink = ({ route }: { route: MappedRouteConfig }) => {
    const isSelected = isItemSelected(route)
    const { PATH, LABEL } = route
    return (
      <ListItemButton
        component={StyledLink}
        underline="none"
        to={PATH}
        sx={{
          py: 2,
          display: 'block',
          borderRight: 2,
          borderColor: isSelected ? 'primary.main' : 'common.white',
          backgroundColor: isSelected ? 'rgba(0, 115, 230, 0.08)' : 'transparent',
          color: isSelected ? 'primary.main' : 'text.primary',
        }}
      >
        <ListItemText
          disableTypography
          sx={{ color: 'inherit' }}
          primary={
            <Typography color="inherit" sx={{ fontWeight: isSelected ? 600 : 300, pl: 4 }}>
              {LABEL}
            </Typography>
          }
        />
      </ListItemButton>
    )
  }

  return (
    <Box sx={{ display: 'block', py: 3, boxShadow: 5 }} component="nav">
      {shouldRender && (
        <List
          sx={{ width: WIDTH, position: 'sticky', top: 10 }}
          aria-label="Navigazione principale"
          disablePadding
        >
          {items.map((item, i) => {
            const isSubmenuOpen = openSubmenuId === item.id
            const isSelected = isItemSelected(item.route)

            return !!item.children && Boolean(item.children.length > 0) ? (
              <Box key={i} color={isSelected ? 'primary.main' : 'text.primary'}>
                <ListItemButton color="inherit" onClick={wrapSetOpenSubmenuId(item.id)}>
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
                        <WrappedLink route={child} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ) : (
              <ListItem sx={{ display: 'block', p: 0 }} key={i}>
                <WrappedLink route={item.route} />
              </ListItem>
            )
          })}
        </List>
      )}
    </Box>
  )
}
