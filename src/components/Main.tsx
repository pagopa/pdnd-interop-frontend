import React, { useContext } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { BASE_ROUTE, ROUTES, SHOW_DEV_LABELS } from '../lib/constants'
import { UserContext } from '../lib/context'
import { NotFound } from '../views/NotFound'

export function Main() {
  const { user } = useContext(UserContext)

  return (
    <main className={`pb-4${!SHOW_DEV_LABELS ? ' hideDevLabels' : ''}`}>
      <Switch>
        {Object.values(ROUTES).map(({ PATH, EXACT, COMPONENT: Component }, i) => (
          <Route path={PATH} exact={EXACT} key={i}>
            {Component && <Component />}
          </Route>
        ))}

        <Route path="/" exact={true}>
          <Redirect to={BASE_ROUTE} />
        </Route>
        {/* If on the ROOT, redirect to platform or login page based on whether the user is logged in */}
        <Route path={BASE_ROUTE} exact={true}>
          <Redirect to={user !== null ? ROUTES.SUBSCRIBE.PATH : ROUTES.LOGIN.PATH} />
        </Route>

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </main>
  )
}
