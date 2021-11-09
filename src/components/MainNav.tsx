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
import { ProviderOrSubscriber, RouteConfig, UserPlatformRole } from '../../types'
import { ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { isActiveTree } from '../lib/router-utils'
import { StyledLink } from './Shared/StyledLink'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { buildNestedUrl } from '../lib/url-utils'

type View = {
  route: RouteConfig
  type?: ProviderOrSubscriber
  children?: Array<RouteConfig>
}

type Views = { [key in UserPlatformRole]: View[] }

const WIDTH = 340

export function MainNav() {
  const { party } = useContext(PartyContext)
  const location = useLocation()
  const [open, setOpen] = useState<ProviderOrSubscriber | null>(null)

  const wrapSetOpen = (menu: ProviderOrSubscriber) => () => {
    setOpen(!open || menu !== open ? menu : null)
  }

  const computeFontWeight = (path: string) => {
    return isActiveTree(location, path) ? 600 : 300
  }

  const WrappedLink = ({ route }: { route: RouteConfig }) => {
    const builtPath = buildNestedUrl(route)

    return (
      <StyledLink underline="none" to={builtPath}>
        <ListItemText
          disableTypography
          primary={
            <Typography sx={{ fontWeight: computeFontWeight(builtPath) }}>{route.label}</Typography>
          }
        />
      </StyledLink>
    )
  }

  const views: Views = {
    admin: [
      {
        route: ROUTES.provide,
        type: 'provider',
        children: [
          ROUTES.provide.children!.eservice.children!.list,
          ROUTES.provide.children!.agreement.children!.list,
          ROUTES.provide.children!.operator.children!.list,
        ],
      },
      {
        route: ROUTES.subscribe,
        type: 'subscriber',
        children: [
          ROUTES.subscribe.children!.catalog.children!.list,
          ROUTES.subscribe.children!.client.children!.list,
          ROUTES.subscribe.children!.agreement.children!.list,
        ],
      },
    ],
    api: [
      {
        route: ROUTES.provide,
        type: 'provider',
        children: [ROUTES.provide.children!.eservice.children!.list],
      },
    ],
    security: [
      {
        route: ROUTES.subscribe,
        type: 'subscriber',
        children: [
          ROUTES.subscribe.children!.catalog.children!.list,
          ROUTES.subscribe.children!.client.children!.list,
        ],
      },
    ],
  }

  const availableViews = [
    ...views[party?.platformRole || 'security'],
    { route: ROUTES.notification },
    { route: ROUTES.profile },
    { route: ROUTES.help },
  ]

  return (
    <Box
      sx={{
        bgcolor: 'common.white',
        display: 'block',
        py: 10,
        position: 'relative',
        '::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bgcolor: 'common.white',
          width: 10000,
          height: '100%',
          transform: 'translate(-100%, 0)',
        },
      }}
      component="nav"
    >
      <List
        sx={{ width: WIDTH, position: 'sticky', top: 10 }}
        aria-label="Navigazione principale"
        disablePadding
      >
        {availableViews.map((view, i) => {
          const isActive = open === view.type

          return !!view.children && Boolean(view.children.length > 0) ? (
            <Box key={i} color="primary.main">
              <ListItemButton onClick={wrapSetOpen(view.type!)}>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography sx={{ fontWeight: computeFontWeight(view.route.path) }}>
                      {view.route.label}
                    </Typography>
                  }
                />
                {isActive ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={isActive} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ width: WIDTH, pl: 2 }}>
                  {view.children!.map((child, j) => (
                    <ListItem sx={{ display: 'block' }} key={j}>
                      <WrappedLink route={child} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          ) : (
            <ListItem sx={{ display: 'block' }} key={i}>
              <WrappedLink route={view.route} />
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
