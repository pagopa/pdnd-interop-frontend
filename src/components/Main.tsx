import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { Switch, Redirect, Route, useLocation } from 'react-router-dom'
import { SHOW_DEV_LABELS } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { StyledBreadcrumbs } from './Shared/StyledBreadcrumbs'
import { showPlatformTwoColumnsLayout } from '../lib/router-utils'
import { ROUTES } from '../config/routes'
import { AuthGuard } from './AuthGuard'
import { RouteAuthLevel } from '../../types'

export function Main() {
  const { party } = useContext(PartyContext)
  const location = useLocation()

  return (
    <Box
      component="main"
      sx={{ pt: 1.5, pb: 4 }}
      className={!SHOW_DEV_LABELS ? ' hideDevLabels' : ''}
    >
      {showPlatformTwoColumnsLayout(location) && <StyledBreadcrumbs />}

      <Switch>
        {Object.values(ROUTES).map((route, i) => {
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
          <Redirect to={party !== null ? ROUTES.SUBSCRIBE.PATH : ROUTES.CHOOSE_PARTY.PATH} />
        </Route>
      </Switch>
    </Box>
  )
}
