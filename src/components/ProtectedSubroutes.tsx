import React from 'react'
import { Route, Switch } from 'react-router'
import { Redirect } from 'react-router-dom'
import { RouteConfig, RoutesObject } from '../../types'

type SubroutingProps = {
  subroutes: RoutesObject
  redirectDestRoute?: RouteConfig
}

export function ProtectedSubroutes({ subroutes, redirectDestRoute }: SubroutingProps) {
  return (
    <React.Fragment>
      <Switch>
        {Object.values(subroutes).map(({ PATH, COMPONENT: Component, EXACT }, i) => (
          <Route path={PATH} key={i} exact={EXACT}>
            {Component && <Component />}
          </Route>
        ))}

        {redirectDestRoute && (
          <Route path="/" exact={true}>
            <Redirect to={redirectDestRoute.PATH} />
          </Route>
        )}
      </Switch>
    </React.Fragment>
  )
}
