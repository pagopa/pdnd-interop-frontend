import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { SectionHeader } from '../components/SectionHeader'
import { withLogin } from '../components/withLogin'
import { ROUTES } from '../lib/constants'

function SubscribeComponent() {
  return (
    <div>
      <SectionHeader view="subscriber" />
      <div>fruizione</div>

      <Switch>
        {Object.values(ROUTES.SUBSCRIBE.SUBROUTES).map(
          ({ PATH, COMPONENT: Component, EXACT }, i) => (
            <Route path={PATH} key={i} exact={EXACT}>
              <Component />
            </Route>
          )
        )}

        <Route path={ROUTES.ROOT.PATH}>
          <Redirect to={ROUTES.SUBSCRIBE.SUBROUTES.CLIENT_LIST.PATH} />
        </Route>
      </Switch>
    </div>
  )
}

export const Subscribe = withLogin(SubscribeComponent)
