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
import { PartyContext, UserContext } from '../lib/context'
import { isActiveTree } from '../lib/router-utils'
import { includesAny } from '../lib/string-utils'
import { StyledLink } from './Shared/StyledLink'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

type View = {
  route: RouteConfig
  type?: ProviderOrSubscriber
  children?: RouteConfig[]
}

type Views = { [key in UserPlatformRole]: View[] }

const WIDTH = '21.25rem' // aka 340px

export function MainNav() {
  const { user } = useContext(UserContext)
  const { party } = useContext(PartyContext)
  const location = useLocation()
  const isInPlatform = includesAny(location.pathname, [
    ROUTES.PROVIDE.PATH,
    ROUTES.SUBSCRIBE.PATH,
    ROUTES.PROFILE.PATH,
    ROUTES.NOTIFICATION.PATH,
  ])
  const [open, setOpen] = useState<ProviderOrSubscriber | null>(null)

  const wrapSetOpen = (menu: ProviderOrSubscriber) => () => {
    setOpen(!open ? menu : null)
  }

  const computeFontWeight = (path: string) => {
    return isActiveTree(location, path) ? 600 : 300
  }

  if (!isInPlatform || !user) {
    return null
  }

  const WrappedLink = ({ route: { PATH, LABEL } }: { route: RouteConfig }) => {
    return (
      <StyledLink underline="none" to={PATH}>
        <ListItemText
          disableTypography
          primary={<Typography sx={{ fontWeight: computeFontWeight(PATH) }}>{LABEL}</Typography>}
        />
      </StyledLink>
    )
  }

  const views: Views = {
    admin: [
      {
        route: ROUTES.PROVIDE,
        type: 'provider',
        children: [
          ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST,
          ROUTES.PROVIDE.SUBROUTES!.AGREEMENT_LIST,
          ROUTES.PROVIDE.SUBROUTES!.OPERATOR_API_LIST,
        ],
      },
      {
        route: ROUTES.SUBSCRIBE,
        type: 'subscriber',
        children: [
          ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST,
          ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST,
          ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_LIST,
        ],
      },
    ],
    api: [
      {
        route: ROUTES.PROVIDE,
        type: 'provider',
        children: [ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST],
      },
    ],
    security: [
      {
        route: ROUTES.SUBSCRIBE,
        type: 'subscriber',
        children: [
          ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST,
          ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST,
        ],
      },
    ],
  }

  const availableViews = [
    ...views[party?.platformRole || 'security'],
    { route: ROUTES.NOTIFICATION },
    { route: ROUTES.PROFILE },
    { route: ROUTES.HELP },
  ]

  return (
    <Box sx={{ bgcolor: 'common.white', display: 'block', py: '5rem' }} component="nav">
      <List sx={{ width: WIDTH }} aria-label="Navigazione principale" disablePadding>
        {availableViews.map((view, i) => {
          const isActive = open === view.type

          return !!view.children && Boolean(view.children.length > 0) ? (
            <Box color="primary.main">
              <ListItemButton key={i} onClick={wrapSetOpen(view.type!)}>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography sx={{ fontWeight: computeFontWeight(view.route.PATH) }}>
                      {view.route.LABEL}
                    </Typography>
                  }
                />
                {isActive ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={isActive} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ width: WIDTH, pl: '1rem' }}>
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
