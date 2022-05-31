import { storageDelete, storageRead, storageWrite } from '../lib/storage-utils'
import { MOCK_TOKEN, STORAGE_KEY_PARTY, STORAGE_KEY_SESSION_TOKEN } from '../lib/constants'
import { useContext } from 'react'
import { TokenContext } from '../lib/context'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { useLocation } from 'react-router-dom'
import { goToLoginPage } from '../lib/router-utils'
import { AxiosResponse } from 'axios'

export const useLogin = () => {
  const { setToken } = useContext(TokenContext)
  const location = useLocation()

  const loginAttempt = async () => {
    // Used only for dev purposes
    if (MOCK_TOKEN) {
      storageWrite(STORAGE_KEY_SESSION_TOKEN, MOCK_TOKEN, 'string')
      setToken(MOCK_TOKEN)
      return
    }

    const selfCareIdentityToken = location.hash.replace('#id=', '')

    // Use Self Care identity token to obtain an Interop session token
    const resp = await fetchWithLogs({
      path: { endpoint: 'AUTH_OBTAIN_SESSION_TOKEN' },
      config: { data: { identity_token: selfCareIdentityToken } },
    })

    // If there is an error in fetching the token, go back to login page
    if (isFetchError(resp)) {
      goToLoginPage()
    }

    // Set Interop session token
    const sessionToken = (resp as AxiosResponse).data.session_token
    storageWrite(STORAGE_KEY_SESSION_TOKEN, sessionToken, 'string')
    setToken(sessionToken)
  }

  const silentLoginAttempt = async (): Promise<boolean> => {
    // Try to get the token from the sessionStorage
    const sessionStorageToken = storageRead(STORAGE_KEY_SESSION_TOKEN, 'string')

    // If there is no token, the session is not authenticated, so
    if (!sessionStorageToken) {
      // Remove any partial data that might have remained, just for safety
      storageDelete(STORAGE_KEY_SESSION_TOKEN)
      storageDelete(STORAGE_KEY_PARTY)
      setToken(null)
      // Return failure (which will lead to a redirect to the login page)
      return false
    }

    // If there is a token, check if it is still valid with a dummy call to the backend
    // TEMP REFACTOR: this is ugly, it can be unified with the useParties hook at this point
    const resp = await fetchWithLogs({ path: { endpoint: 'AUTH_HEALTH_CHECK' } })
    const isTokenValid = !isFetchError(resp)

    // If it is valid, turn it into State so that it is easier
    // to make it interact with React
    if (isTokenValid) {
      setToken(sessionStorageToken)
    }

    return isTokenValid
  }

  return { loginAttempt, silentLoginAttempt }
}
