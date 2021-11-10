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
        {Object.values(subroutes).map((route, i) => {
          const { PATH, COMPONENT, EXACT, PUBLIC, AUTH_LEVELS, SUBROUTES } = route
          return (
            <Route path={PATH} key={i} exact={EXACT}>
              <AuthGuard Component={COMPONENT} isRoutePublic={PUBLIC} authLevels={AUTH_LEVELS} />
              {SUBROUTES && (
                <ProtectedSubroutes
                  subroutes={SUBROUTES}
                  redirectSrcRoute={route}
                  redirectDestRoute={Object.values(SUBROUTES)[0]}
                />
              )}
            </Route>
          )
        })}

        {redirectSrcRoute && redirectDestRoute && (
          <Route path={redirectSrcRoute.PATH} exact={redirectSrcRoute.EXACT}>
            <Redirect to={redirectDestRoute.PATH} />
          </Route>
        )}
      </Switch>
    </React.Fragment>
  )
}
