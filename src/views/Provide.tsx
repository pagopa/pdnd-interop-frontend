import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { SectionHeader } from '../components/SectionHeader'
import { withLogin } from '../components/withLogin'
import { ROUTES } from '../lib/constants'

function ProvideComponent() {
  return (
    <div>
      <SectionHeader view="provider" />
      <div>erogazione</div>

      <Switch>
        {Object.values(ROUTES.PROVIDE.SUBROUTES).map(({ PATH, COMPONENT: Component, EXACT }, i) => (
          <Route path={PATH} key={i} exact={EXACT}>
            <Component />
          </Route>
        ))}

        <Route path={ROUTES.ROOT.PATH}>
          <Redirect to={ROUTES.PROVIDE.SUBROUTES.ESERVICE_LIST.PATH} />
        </Route>
      </Switch>
    </div>
  )
}

export const Provide = withLogin(ProvideComponent)
