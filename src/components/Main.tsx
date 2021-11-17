import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { Switch, Redirect, Route, useLocation } from 'react-router-dom'
import { SHOW_DEV_LABELS } from '../lib/constants'
import { UserContext } from '../lib/context'
import { StyledBreadcrumbs } from './Shared/StyledBreadcrumbs'
import { isInPlatform } from '../lib/router-utils'
import { ROUTES } from '../config/routes'
import { AuthGuard } from './AuthGuard'

export function Main() {
  const { user } = useContext(UserContext)
  const location = useLocation()

  return (
    <Box
      component="main"
      sx={{ pt: 1.5, pb: 4 }}
      className={!SHOW_DEV_LABELS ? ' hideDevLabels' : ''}
    >
      {isInPlatform(location) && <StyledBreadcrumbs />}

      <Switch>
        {Object.values(ROUTES).map((route, i) => {
          const {
            PATH,
            COMPONENT: Component,
            PUBLIC,
            AUTH_LEVELS,
            EXACT = false,
            REDIRECT = false,
          } = route
          return (
            <Route path={PATH} key={i} exact={EXACT}>
              {REDIRECT ? (
                <Redirect to={REDIRECT!} />
              ) : PUBLIC ? (
                <Component />
              ) : (
                <AuthGuard Component={Component} authLevels={AUTH_LEVELS!} />
              )}
            </Route>
          )
        })}

        <Route path="/" exact>
          <Redirect to={user !== null ? ROUTES.SUBSCRIBE.PATH : ROUTES.LOGIN.PATH} />
        </Route>
      </Switch>
    </Box>
  )
}
