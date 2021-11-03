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

type View = {
  route: RouteConfig
  type?: ProviderOrSubscriber
  children?: RouteConfig[]
}

type Views = { [key in UserPlatformRole]: View[] }

const WIDTH = '21.25rem' // aka 340px

export function MainNav() {
  const { party } = useContext(PartyContext)
  const location = useLocation()
  const [open, setOpen] = useState<ProviderOrSubscriber | null>(null)

  const wrapSetOpen = (menu: ProviderOrSubscriber) => () => {
    setOpen(!open ? menu : null)
  }

  const computeFontWeight = (path: string) => {
    return isActiveTree(location, path) ? 600 : 300
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
    <Box
      sx={{
        bgcolor: 'common.white',
        display: 'block',
        py: '5rem',
        position: 'relative',
        '::before': {
          content: '""',
          position: 'absolute',
          left: -24,
          top: 0,
          bgcolor: 'common.white',
          width: 24,
          height: '100%',
        },
      }}
      component="nav"
    >
      <List
        sx={{ width: WIDTH, position: 'sticky', top: '5rem' }}
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
