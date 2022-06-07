import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { RouteAuthLevel } from '../../types'
import { useLogin } from '../hooks/useLogin'
import { goToLoginPage } from '../lib/router-utils'
import { useRoute } from '../hooks/useRoute'
import { Unauthorized } from './Unauthorized'
import { useJwt } from '../hooks/useJwt'
import { intersectionWith } from 'lodash'

type AuthGuardProps = {
  Component: React.FunctionComponent
  authLevels: RouteAuthLevel
}

export function AuthGuard({ Component, authLevels }: AuthGuardProps) {
  const history = useHistory()
  const { jwt, currentRoles } = useJwt()
  const { silentLoginAttempt } = useLogin()
  const { isRouteProtected } = useRoute()

  const isCurrentRouteProtected = isRouteProtected(history.location)

  // If there is no user, attempt to sign him/her in silently
  useEffect(() => {
    async function asyncSilentLoginAttempt() {
      const isNowSilentlyLoggedIn = await silentLoginAttempt()

      // If it still fails, redirect to login module
      // Note: this only applies to private routes, to avoid perpetual loop
      if (!isNowSilentlyLoggedIn && isCurrentRouteProtected) {
        goToLoginPage()
      }
    }

    // The user might still be in session but might have refreshed the page
    // In this case, try to log him/her in by getting their info from storage
    // Same goes if no fetchAvailableParties has occurred yet. We cannot log into
    // a protected page until we have a user
    if (!jwt) {
      asyncSilentLoginAttempt()
    }
  }, [jwt]) // eslint-disable-line react-hooks/exhaustive-deps

  const hasOverlappingRole = intersectionWith(currentRoles, authLevels)
  const userCanAccess = !isCurrentRouteProtected || authLevels === 'any' || hasOverlappingRole

  // If the route can be accessed, display the component
  if (userCanAccess) {
    return <Component />
  }

  // If we identified the user and he/she should not access this resource,
  // show an unauthorized feedback
  return <Unauthorized />
}
