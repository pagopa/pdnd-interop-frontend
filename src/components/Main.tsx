import React, { useContext } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from '../lib/constants'
import { UserContext } from '../lib/context'

export function Main() {
  const { user } = useContext(UserContext)

  const topLevelRoutes = [
    ROUTES.LOGIN,
    ROUTES.LOGOUT,
    ROUTES.HELP,
    ROUTES.ONBOARDING,
    ROUTES.CHOOSE_PARTY,
    ROUTES.NOTIFICATION,
    ROUTES.PROFILE,
    ROUTES.PROVIDE,
    ROUTES.SUBSCRIBE,
  ]

  return (
    <main>
      <Switch>
        {topLevelRoutes.map(({ PATH, COMPONENT: Component }, i) => (
          <Route path={PATH} key={i}>
            <Component />
          </Route>
        ))}
        <Route path={ROUTES.ROOT.PATH}>
          <Redirect to={user !== null ? ROUTES.PROVIDE.PATH : ROUTES.LOGIN.PATH} />
        </Route>
      </Switch>
    </main>
  )
}
