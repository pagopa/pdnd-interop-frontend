import React from 'react'
import { Route, Switch } from 'react-router'
import { Redirect } from 'react-router-dom'
import { RouteConfig, RoutesObject } from '../../types'
import { AuthGuard } from './AuthGuard'

type SubroutingProps = {
  subroutes: RoutesObject
  redirectDestRoute?: RouteConfig
  redirectSrcRoute?: RouteConfig
}

export function ProtectedSubroutes({
  subroutes,
  redirectSrcRoute,
  redirectDestRoute,
}: SubroutingProps) {
  return (
    <React.Fragment>
      <Switch>
        {Object.values(subroutes).map(({ PATH, COMPONENT, PUBLIC, AUTH_LEVELS }, i) => (
          <Route path={PATH} key={i}>
            <AuthGuard Component={COMPONENT} isRoutePublic={PUBLIC} authLevels={AUTH_LEVELS} />
          </Route>
        ))}

        {redirectSrcRoute && redirectDestRoute && (
          <Route path={redirectSrcRoute.PATH}>
            <Redirect to={redirectDestRoute.PATH} />
          </Route>
        )}
      </Switch>
    </React.Fragment>
  )
}
