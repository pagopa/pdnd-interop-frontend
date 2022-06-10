import React, { useContext, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Switch, Redirect, Route, useLocation, useHistory } from 'react-router-dom'
import { DEFAULT_LANG } from '../lib/constants'
import { LangContext } from '../lib/context'
import { StyledBreadcrumbs } from './Shared/StyledBreadcrumbs'
import { AuthGuard } from './AuthGuard'
import { RouteAuthLevel } from '../../types'
import { useRoute } from '../hooks/useRoute'
import { BASIC_ROUTES } from '../config/routes'
import { buildDynamicPath, extractDynamicParams, isSamePath } from '../lib/router-utils'

function CompleteRedirect({ pathname = '' }) {
  return <Redirect to={{ pathname, search: window.location.search, hash: window.location.hash }} />
}

export function Main() {
  const history = useHistory()
  const location = useLocation()
  const { routes, doesRouteAllowTwoColumnsLayout } = useRoute()
  const { lang } = useContext(LangContext)
  const [prevLang, setPrevLang] = useState(lang)

  useEffect(() => {
    if (lang !== prevLang) {
      const prevRoute = Object.values(BASIC_ROUTES).find((r) =>
        isSamePath(history.location.pathname, r.PATH[prevLang])
      )

      const oldPath = prevRoute?.PATH[prevLang] as string
      const dynamicParams = extractDynamicParams(oldPath, history.location.pathname)

      const newPath = prevRoute?.PATH[lang] as string
      const newDynamicPath = buildDynamicPath(newPath, dynamicParams)

      setPrevLang(lang)
      history.push(newDynamicPath)
    }
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box component="main" sx={{ height: '100%' }}>
      {doesRouteAllowTwoColumnsLayout(location) && <StyledBreadcrumbs />}

      <Switch>
        {Object.values(routes).map((route, i) => {
          const { PATH, COMPONENT: Component, AUTH_LEVELS, EXACT = false, REDIRECT = false } = route
          return (
            <Route path={PATH} key={i} exact={EXACT}>
              {REDIRECT ? (
                <CompleteRedirect pathname={REDIRECT as string} />
              ) : (
                <AuthGuard Component={Component} authLevels={AUTH_LEVELS as RouteAuthLevel} />
              )}
            </Route>
          )
        })}

        <Route path="/" exact>
          <CompleteRedirect pathname={DEFAULT_LANG} />
        </Route>

        <Route path={`/${DEFAULT_LANG}`} exact>
          <CompleteRedirect pathname={routes.SUBSCRIBE.PATH} />
        </Route>
      </Switch>
    </Box>
  )
}
