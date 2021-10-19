import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router'
import { RouteAuthLevel } from '../../types'
import { useLogin } from '../hooks/useLogin'
import { ROUTES } from '../lib/constants'
import { LoaderContext, PartyContext, UserContext } from '../lib/context'
import { Unauthorized } from './Unauthorized'

type AuthGuardProps = {
  Component: React.FunctionComponent<any>
  isRoutePublic: boolean
  authLevels?: RouteAuthLevel
}

export function AuthGuard({ Component, isRoutePublic, authLevels }: AuthGuardProps) {
  const history = useHistory()
  const { party } = useContext(PartyContext)
  const { user } = useContext(UserContext)
  const { loadingText } = useContext(LoaderContext)
  const { attemptSilentLogin } = useLogin()

  useEffect(() => {
    async function asyncAttemptSilentLogin() {
      const isNowSilentlyLoggedIn = await attemptSilentLogin()

      // Exclude the routes necessary to log in to avoid perpetual loop
      const whitelist = [
        ROUTES.LOGIN,
        ROUTES.TEMP_SPID_USER,
        ROUTES.REGISTRATION_FINALIZE_COMPLETE,
        ROUTES.REGISTRATION_FINALIZE_REJECT,
        ROUTES.SECURITY_KEY_GUIDE,
      ]
      const isWhitelistedPage = whitelist.map((r) => r.PATH).includes(history.location.pathname)

      // If it still fails, redirect to login page
      if (!isNowSilentlyLoggedIn && !isWhitelistedPage) {
        history.push('/')
      }
    }

    // The user might still be in session but might have refreshed the page
    // In this case, try to log him/her in by getting their info from localStorage
    if (!user) {
      asyncAttemptSilentLogin()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const userCanAccess =
    !isRoutePublic &&
    (authLevels! === 'any' || (party && authLevels!.includes(party!.platformRole)))

  if ((loadingText && !user) || isRoutePublic || userCanAccess) {
    return <Component /> // TEMP REFACTOR: this null can actually be a skeleton while silently trying to login
  }

  return <Unauthorized />
}
