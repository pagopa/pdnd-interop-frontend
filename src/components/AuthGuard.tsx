import { Skeleton } from '@mui/material'
import React, { useContext } from 'react'
import { RouteAuthLevel } from '../../types'
import { LoaderContext, PartyContext, UserContext } from '../lib/context'
import { Unauthorized } from './Unauthorized'

type AuthGuardProps = {
  Component: React.FunctionComponent<any>
  authLevels: RouteAuthLevel
}

export function AuthGuard({ Component, authLevels }: AuthGuardProps) {
  // const history = useHistory()
  const { party, availableParties } = useContext(PartyContext)
  const { user } = useContext(UserContext)
  const { loadingText } = useContext(LoaderContext)

  // const { silentLoginAttempt } = useLogin()
  // const { fetchAvailablePartiesAttempt, setPartyFromStorageAttempt } = useParties()

  /*
  useEffect(() => {
    async function asyncAttemptSilentLogin() {
      const isNowSilentlyLoggedIn = await silentLoginAttempt()

      // Exclude the routes necessary to log in to avoid perpetual loop
      const whitelist = Object.values(ROUTES).filter((r) => r.PUBLIC)
      const isWhitelistedPage = whitelist.map((r) => r.PATH).includes(history.location.pathname)

      // If it still fails, redirect to login page
      if (!isNowSilentlyLoggedIn && !isWhitelistedPage) {
        history.push('/')
      }
    }

    // The user might still be in session but might have refreshed the page
    // In this case, try to log him/her in by getting their info from localStorage
    // Same goes if no fetchAvailableParties has occurred yet. We cannot log into
    // a protected page until we have a user and a list of availableParties
    if (!user) {
      asyncAttemptSilentLogin()
    }

    // If the user is logged in but hasn't chosen a party yet, go there
    // to avoid having users without a current party.
    // TEMP REFACTOR: this is horrible. It is here only because party be set slightly after
    // setTimeout(() => {
    //   if (user && !party) {
    //     history.push(ROUTES.CHOOSE_PARTY.PATH)
    //   }
    // }, 500)
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps
  */

  // useEffect(() => {
  //   async function asyncFetchAvailableParties() {
  //     await fetchAvailablePartiesAttempt()
  //     setPartyFromStorageAttempt()
  //   }

  //   if (!availableParties) {
  //     asyncFetchAvailableParties()
  //   }
  // }, [availableParties]) // eslint-disable-line react-hooks/exhaustive-deps

  console.log('--- AuthGuard ---', { loadingText, user, availableParties })

  const isLoading = loadingText && (!user || !availableParties)

  // If we are still fetching data, display a skeleton
  if (isLoading) {
    return (
      <React.Fragment>
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} height={400} />
          ))}
      </React.Fragment>
    )
  }

  // If the route can be accessed, display the component
  const userCanAccess = authLevels === 'any' || (party && authLevels.includes(party!.platformRole))
  if (userCanAccess) {
    return <Component />
  }

  // If data was fetched but user cannot access, tell them
  return <Unauthorized />
}
