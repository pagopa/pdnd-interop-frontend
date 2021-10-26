import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import { Box } from '@mui/material'
import { RouteConfig, UserPlatformRole } from '../../types'
import { ROUTES } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'
import { isParentRoute, isRoute } from '../lib/router-utils'
import { includesAny } from '../lib/string-utils'
import { Layout } from './Shared/Layout'
import { StyledLink } from './Shared/StyledLink'

type View = {
  route: RouteConfig
  children: RouteConfig[]
}

type Views = { [key in UserPlatformRole]: View[] }

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

  if (!isInPlatform || !user) {
    return null
  }

  const WrappedLink = ({ route: { PATH, LABEL } }: { route: RouteConfig }) => {
    const isActive = isRoute(location, PATH) || isParentRoute(location, PATH)

    return (
      <StyledLink underline="none" fontWeight={isActive ? 600 : 300} to={PATH}>
        {LABEL}
      </StyledLink>
    )
  }

  const views: Views = {
    admin: [
      {
        route: ROUTES.PROVIDE,
        children: [
          ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST,
          ROUTES.PROVIDE.SUBROUTES!.AGREEMENT_LIST,
          ROUTES.PROVIDE.SUBROUTES!.OPERATOR_API_LIST,
        ],
      },
      {
        route: ROUTES.SUBSCRIBE,
        children: [
          ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST,
          ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST,
          ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_LIST,
        ],
      },
    ],
    api: [{ route: ROUTES.PROVIDE, children: [ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST] }],
    security: [
      {
        route: ROUTES.SUBSCRIBE,
        children: [
          ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST,
          ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST,
        ],
      },
    ],
  }

  const availableViews = views[party?.platformRole || 'security']

  return (
    <Box sx={{ bgcolor: 'common.white', display: 'block' }} component="nav">
      <Layout>
        <ul>
          {availableViews.map((view, i) => {
            return (
              <li key={i}>
                <WrappedLink route={view.route} />

                {Boolean(view.children.length > 0) && (
                  <ul>
                    {view.children.map((child, j) => (
                      <li key={j}>
                        <WrappedLink route={child} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}

          {[ROUTES.NOTIFICATION, ROUTES.PROFILE, ROUTES.HELP].map((route, i) => (
            <li key={i}>
              <WrappedLink route={route} />
            </li>
          ))}
        </ul>
      </Layout>
    </Box>
  )
}
