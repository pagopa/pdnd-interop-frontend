import React, { useContext, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Switch, Redirect, Route, useLocation, useHistory } from 'react-router-dom'
import { DEFAULT_LANG, SHOW_DEV_LABELS } from '../lib/constants'
import { LangContext, PartyContext } from '../lib/context'
import { StyledBreadcrumbs } from './Shared/StyledBreadcrumbs'
import { AuthGuard } from './AuthGuard'
import { RouteAuthLevel } from '../../types'
import { useRoute } from '../hooks/useRoute'
import { BASIC_ROUTES } from '../config/routes'
import { buildDynamicPath, extractDynamicParams, isSamePath } from '../lib/router-utils'

export function Main() {
  const { party } = useContext(PartyContext)
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
    <Box
      component="main"
      sx={{ pt: 1.5, pb: 4 }}
      className={!SHOW_DEV_LABELS ? ' hideDevLabels' : ''}
    >
      {doesRouteAllowTwoColumnsLayout(location) && <StyledBreadcrumbs />}

      <Switch>
        {Object.values(routes).map((route, i) => {
          const { PATH, COMPONENT: Component, AUTH_LEVELS, EXACT = false, REDIRECT = false } = route
          return (
            <Route path={PATH} key={i} exact={EXACT}>
              {REDIRECT ? (
                <Redirect to={REDIRECT as string} />
              ) : (
                <AuthGuard Component={Component} authLevels={AUTH_LEVELS as RouteAuthLevel} />
              )}
            </Route>
          )
        })}

        <Route path="/" exact>
          <Redirect to={DEFAULT_LANG} />
        </Route>

        <Route path={`/${DEFAULT_LANG}`} exact>
          <Redirect to={party !== null ? routes.SUBSCRIBE.PATH : routes.CHOOSE_PARTY.PATH} />
        </Route>
      </Switch>
    </Box>
  )
}
