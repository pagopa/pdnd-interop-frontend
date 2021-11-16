import React from 'react'
import { Route, Switch } from 'react-router'
import { Redirect } from 'react-router-dom'
import { RouteConfig } from '../../types'
import { AuthGuard } from './AuthGuard'

type SubroutingProps = {
  subroutes: Record<string, RouteConfig>
  redirectDestRoute?: Partial<RouteConfig>
  redirectSrcRoute?: Partial<RouteConfig>
}

export function ProtectedSubroutes({
  subroutes,
  redirectSrcRoute,
  redirectDestRoute,
}: SubroutingProps) {
  return (
    <Switch>
      {Object.values(subroutes).map((route, i) => {
        const { PATH, COMPONENT, RENDER = true, EXACT, PUBLIC, AUTH_LEVELS, SUBROUTES } = route
        return (
          <Route path={PATH} key={i} exact={EXACT}>
            {RENDER && (
              <AuthGuard Component={COMPONENT} isRoutePublic={PUBLIC} authLevels={AUTH_LEVELS} />
            )}
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
          <Redirect to={redirectDestRoute.PATH!} />
        </Route>
      )}
    </Switch>
  )
}
