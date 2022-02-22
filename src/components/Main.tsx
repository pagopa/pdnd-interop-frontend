import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { Switch, Redirect, Route, useLocation } from 'react-router-dom'
import { DEFAULT_LANG, SHOW_DEV_LABELS } from '../lib/constants'
import { PartyContext, RoutesContext } from '../lib/context'
import { StyledBreadcrumbs } from './Shared/StyledBreadcrumbs'
import { AuthGuard } from './AuthGuard'
import { RouteAuthLevel } from '../../types'
import { useRoute } from '../hooks/useRoute'

export function Main() {
  const { party } = useContext(PartyContext)
  const { routes } = useContext(RoutesContext)
  const location = useLocation()
  const { doesRouteAllowTwoColumnsLayout } = useRoute()

  return (
    <Box
      component="main"
      sx={{ pt: 1.5, pb: 4 }}
      className={!SHOW_DEV_LABELS ? ' hideDevLabels' : ''}
    >
      {doesRouteAllowTwoColumnsLayout(location) && <StyledBreadcrumbs />}

      <Switch>
        {Object.values(routes).map((route, i) => {
          const { PATH, COMPONENT: Component, AUTH_LEVELS, EXACT = false, REDIRECT = false } = route
          return (
            <Route path={PATH} key={i} exact={EXACT}>
              {REDIRECT ? (
                <Redirect to={REDIRECT as string} />
              ) : (
                <AuthGuard Component={Component} authLevels={AUTH_LEVELS as RouteAuthLevel} />
              )}
            </Route>
          )
        })}

        <Route path="/" exact>
          <Redirect to={DEFAULT_LANG} />
        </Route>

        <Route path={`/${DEFAULT_LANG}`} exact>
          <Redirect to={party !== null ? routes.SUBSCRIBE.PATH : routes.CHOOSE_PARTY.PATH} />
        </Route>
      </Switch>
    </Box>
  )
}
