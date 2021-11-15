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
import { PartyContext } from '../lib/context'
import { isActiveTree } from '../lib/router-utils'
import { StyledLink } from './Shared/StyledLink'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { ROUTES } from '../config/routes'

type View = {
  route: RouteConfig
  type?: ProviderOrSubscriber
  children?: RouteConfig[]
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

  const WrappedLink = ({ route }: { route: RouteConfig }) => {
    const isSelected = isActiveTree(location, route)
    const { PATH, LABEL } = route
    return (
      <StyledLink underline="none" to={PATH}>
        <ListItemText
          disableTypography
          primary={
            <Typography
              color="inherit"
              sx={{
                borderRight: 2,
                fontWeight: isSelected ? 600 : 300,
                borderColor: isSelected ? 'primary.min' : 'common.white',
                px: 2,
                py: 1,
              }}
            >
              {LABEL}
            </Typography>
          }
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
          ROUTES.PROVIDE.SUBROUTES!.ESERVICE,
          ROUTES.PROVIDE.SUBROUTES!.AGREEMENT,
          ROUTES.PROVIDE.SUBROUTES!.OPERATOR,
        ],
      },
      {
        route: ROUTES.SUBSCRIBE,
        type: 'subscriber',
        children: [
          ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG,
          ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT,
          ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT,
        ],
      },
    ],
    api: [
      {
        route: ROUTES.PROVIDE,
        type: 'provider',
        children: [ROUTES.PROVIDE.SUBROUTES!.ESERVICE],
      },
    ],
    security: [
      {
        route: ROUTES.SUBSCRIBE,
        type: 'subscriber',
        children: [ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG, ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT],
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
          const isSelected = isActiveTree(location, view.route)

          return !!view.children && Boolean(view.children.length > 0) ? (
            <Box key={i} color="primary.main">
              <ListItemButton onClick={wrapSetOpen(view.type!)}>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography color="inherit" sx={{ fontWeight: isSelected ? 600 : 300 }}>
                      {view.route.LABEL}
                    </Typography>
                  }
                />
                {isActive ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={isActive} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ width: WIDTH, pl: 2 }}>
                  {view.children!.map((child, j) => (
                    <ListItem sx={{ display: 'block', p: 0 }} key={j}>
                      <WrappedLink route={child} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          ) : (
            <ListItem sx={{ display: 'block', p: 0 }} key={i}>
              <WrappedLink route={view.route} />
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
