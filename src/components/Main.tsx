import React, { useContext } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from '../lib/constants'
import { UserContext } from '../lib/context'
import { NotFound } from '../views/NotFound'

export function Main() {
  const { user } = useContext(UserContext)

  return (
    <main>
      <Switch>
        {Object.values(ROUTES).map(({ PATH, EXACT, COMPONENT: Component }, i) => (
          <Route path={PATH} exact={EXACT} key={i}>
            {Component && <Component />}
          </Route>
        ))}

        {/* If on the ROOT, redirect to platform or login page based on whether the user is logged in */}
        <Route path="/" exact={true}>
          <Redirect to={user !== null ? ROUTES.PROVIDE.PATH : ROUTES.LOGIN.PATH} />
        </Route>

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </main>
  )
}
