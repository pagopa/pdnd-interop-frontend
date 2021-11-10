import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import { BASE_ROUTE, ROUTES, SHOW_DEV_LABELS } from '../lib/constants'
import { UserContext } from '../lib/context'
import { AuthGuard } from './AuthGuard'
import { StyledBreadcrumbs } from './Shared/StyledBreadcrumbs'
import { isInPlatform } from '../lib/router-utils'

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
        {Object.values(ROUTES).map(({ PATH, EXACT, COMPONENT, PUBLIC, AUTH_LEVELS }, i) => (
          <Route path={PATH} exact={EXACT} key={i}>
            <AuthGuard Component={COMPONENT} isRoutePublic={PUBLIC} authLevels={AUTH_LEVELS} />
          </Route>
        ))}

        <Route path="/" exact={true}>
          <Redirect to={BASE_ROUTE} />
        </Route>

        {/* If on the ROOT, redirect to platform or login page based on whether the user is logged in */}
        <Route path={BASE_ROUTE} exact={true}>
          <Redirect to={user !== null ? ROUTES.SUBSCRIBE.PATH : ROUTES.LOGIN.PATH} />
        </Route>
      </Switch>
    </Box>
  )
}
