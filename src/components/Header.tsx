import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { isParentRoute, isRoute } from '../lib/router-utils'
import { includesAny } from '../lib/string-utils'
import { MainHeader } from './MainHeader'
import { PageTitle } from './PageTitle'

function PlatformHeader() {
  const { party } = useContext(PartyContext)
  const location = useLocation()

  const getStyle = (path: string) => ({
    backgroundColor:
      isParentRoute(location, path) || isRoute(location, path) ? 'yellow' : 'transparent',
  })

  return (
    <div>
      <nav>
        <ul>
          <li style={getStyle(ROUTES.PROVIDE.PATH)}>
            <Link to={ROUTES.PROVIDE.PATH}>{ROUTES.PROVIDE.LABEL}</Link>
          </li>
          <li style={getStyle(ROUTES.SUBSCRIBE.PATH)}>
            <Link to={ROUTES.SUBSCRIBE.PATH}>{ROUTES.SUBSCRIBE.LABEL}</Link>
          </li>
        </ul>
      </nav>
      <div>
        {party && <div>{party.name}</div>}
        <Link style={getStyle(ROUTES.NOTIFICATION.PATH)} to={ROUTES.NOTIFICATION.PATH}>
          {ROUTES.NOTIFICATION.LABEL}
        </Link>
        <Link style={getStyle(ROUTES.PROFILE.PATH)} to={ROUTES.PROFILE.PATH}>
          {ROUTES.PROFILE.LABEL}
        </Link>
      </div>
    </div>
  )
}

export function Header() {
  const location = useLocation()
  const isInPlatform = includesAny(location.pathname, [
    ROUTES.PROVIDE.PATH,
    ROUTES.SUBSCRIBE.PATH,
    ROUTES.PROFILE.PATH,
    ROUTES.NOTIFICATION.PATH,
  ])

  return (
    <header>
      <MainHeader />
      <PageTitle />
      {isInPlatform && <PlatformHeader />}
    </header>
  )
}
