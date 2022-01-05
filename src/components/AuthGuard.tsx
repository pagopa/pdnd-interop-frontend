import React, { useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import { RouteAuthLevel } from '../../types'
import { ROUTES } from '../config/routes'
import { useLogin } from '../hooks/useLogin'
import { useParties } from '../hooks/useParties'
import { URL_FE_LOGIN } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'
import { isSamePath } from '../lib/router-utils'
import { Unauthorized } from './Unauthorized'

type AuthGuardProps = {
  Component: React.FunctionComponent
  authLevels: RouteAuthLevel
}

export function AuthGuard({ Component, authLevels }: AuthGuardProps) {
  const history = useHistory()
  const location = useLocation()
  const { party, availableParties } = useContext(PartyContext)
  const { user } = useContext(UserContext)
  const { silentLoginAttempt } = useLogin()
  const { fetchAvailablePartiesAttempt, setPartyFromStorageAttempt } = useParties()

  // If there is no user, attempt to sign him/her in silently
  useEffect(() => {
    // The user might still be in session but might have refreshed the page
    // In this case, try to log him/her in by getting their info from storage
    // Same goes if no fetchAvailableParties has occurred yet. We cannot log into
    // a protected page until we have a user
    if (!user) {
      const isNowSilentlyLoggedIn = silentLoginAttempt()

      // Exclude the routes necessary to log in to avoid perpetual loop
      const whitelist = Object.values(ROUTES).filter((r) => r.PUBLIC)
      const isWhitelistedPage = whitelist.map((r) => r.PATH).includes(history.location.pathname)

      // If it still fails, redirect to login page
      if (!isNowSilentlyLoggedIn && !isWhitelistedPage) {
        window.location.assign(URL_FE_LOGIN)
      }
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  // If there are no availableParties, try to fetch and set them
  useEffect(() => {
    async function asyncSilentAssignPartyAttempt() {
      const hasFetchedAndSetAvailableParties = await fetchAvailablePartiesAttempt()
      const hasSetParty = setPartyFromStorageAttempt()
      // If something goes wrong in fetching or setting the user,
      // redirect to login page
      if (!hasFetchedAndSetAvailableParties || !hasSetParty) {
        window.location.assign(URL_FE_LOGIN)
      }
    }

    // If we have a logged user but don't have available parties,
    // and we are not in the ChooseParty view, fetch
    // the available parties and attempt to assign one
    // to the user by reading into the localStorage
    const isChoosePartyPage = isSamePath(location.pathname, ROUTES.CHOOSE_PARTY.PATH)

    if (user && !availableParties && !isChoosePartyPage) {
      asyncSilentAssignPartyAttempt()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  // If the route can be accessed, display the component
  const userCanAccess =
    authLevels === 'any' || (party && authLevels.includes(party.productInfo.role))
  if (userCanAccess) {
    return <Component />
  }

  // If we identified the user and he/she should not access this resource,
  // show an unauthorized feedback
  return <Unauthorized />
}
